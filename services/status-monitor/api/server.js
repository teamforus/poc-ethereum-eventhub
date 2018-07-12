const config = require('./config.json');
const eventHub = require('event-hub');
const eventList = require('event-list');
const eventDataList = eventList.Data;
const WebSocketServer = require('websocket').server;

const history = {};

const onRequest = (client) => {
    const connection = client.accept(null, client.origin);
    const message = {
        "type": "history",
        "history": history
    }
    connection.sendUTF(JSON.stringify(message));
}

const onDisconnect = (client) => {

}

const api = ((config) => {
    const http = require('http');
    const httpServer = http.createServer((request, response) => {});
    httpServer.listen(config['server']['port'], () => {});
    const self = new WebSocketServer({
        httpServer: httpServer
    });
    self.on('request', onRequest);
    self.on('close', onDisconnect);
    return self;
})(config);

const onEvent = (eventName, eventData, eventTime) => {
    if (eventName === eventList.STATUS_RESPONSE) {
        const sender = eventData[eventDataList.SENDER];
        const status = eventData[eventDataList.STATUS_CODE];
        const statusMessage = eventData[eventDataList.ERROR_MESSAGE];
        const message = {
            status: status,
            message: statusMessage,
            time: eventTime
        };
        history[sender] = message;
        message['name'] = sender;
        message['type'] = "update";
        api.broadcast(JSON.stringify(message));
    }
}

eventHub.configure(config, require('./package.json'));
eventHub.start(onEvent);
const interval = setInterval(() => {
    console.log('Pinging new versions...');
    eventHub.send(eventList.STATUS_REQUEST);
}, config['server']['interval']);


