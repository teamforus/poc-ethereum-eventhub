const config = require('./config.json');
const eventHub = require('event-hub');
const eventList = require('event-list');
const eventDataList = eventList.Data;
const WebSocketServer = require('websocket').server;

const history = {};

const onMessage = (message) => {
    if (message.type === 'utf8') {
        const json = JSON.parse(message.utf8Data);
        const request = json.request;
        if (request === 'testError') {
            eventHub.error('This is merely a test');
        } else if (request === 'testOffline') {
            const body = {};
            body[eventDataList.STATUS_CODE] = eventDataList.STATUS_CODES.OFFLINE;
            body[eventDataList.ERROR_MESSAGE] = ['This is a test', 'Offline response requested by status-monitor-api.onMessage'];
            eventHub.send(eventList.STATUS_RESPONSE, body);
        } else if (request === 'refresh') {
            eventHub.send(eventList.STATUS_REQUEST);
        }
    }
}

const onRequest = (client) => {
    const connection = client.accept(null, client.origin);
    connection.on('message', onMessage);
    const message = {
        type: "history",
        history: history
    }
    connection.sendUTF(JSON.stringify(message));
}

const onDisconnect = (client) => {

}

const api = ((config) => {
    const http = require('http');
    const httpServer = http.createServer((request, response) => { });
    httpServer.listen(config['server']['port'], () => { });
    const self = new WebSocketServer({
        httpServer: httpServer
    });
    self.on('request', onRequest);
    self.on('close', onDisconnect);
    return self;
})(config);

const onEvent = (eventName, eventData, eventTime) => {
    const sender = eventData[eventDataList.SENDER];
    if (!history[sender]) history[sender] = {name: sender};
    if (eventName === eventList.STATUS_RESPONSE) {
        const status = eventData[eventDataList.STATUS_CODE];
        const statusMessage = eventData[eventDataList.ERROR_MESSAGE];
        console.log('Received status of "' + sender + '" on ' + (new Date(eventTime)).toISOString().split('T')[0] + ': ' + status);
        history[sender].status = status;
        history[sender].statusMessage = statusMessage;
        history[sender].time = eventTime;
        sendUpdate(sender);
    } else if (eventName === eventList.VERSION_RESPONSE) {
        const version = eventData[eventDataList.VERSION_RELEASE] + '.' +
            eventData[eventDataList.VERSION_PATCH] + '.' +
            eventData[eventDataList.VERSION_HOTFIX];
        history[sender].version = version;
        sendUpdate(sender);
    }
}

const sendUpdate = (name) => {
    if (!!history[name]) {
        try {
            // clone history object
            const message = JSON.parse(JSON.stringify(history[name]));
            message['name'] = name;
            message['type'] = "update";
            api.broadcast(JSON.stringify(message));
        } catch (error) {
            console.log(history[name]);
        }
    }
}

eventHub.configure(config, require('./package.json'));
eventHub.start(onEvent);
console.log('Listening on eventhub');
console.log('Requesting current listeners...');
setTimeout(() => {
    eventHub.send(eventList.VERSION_REQUEST);
    eventHub.send(eventList.STATUS_REQUEST);
}, 1000);
/*const interval = setInterval(() => {
    console.log('Pinging new versions...');
    eventHub.send(eventList.STATUS_REQUEST);
}, config['server']['interval']);*/


