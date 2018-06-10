/*jshint esversion: 6 */

const partitionId = "1";

const AzureEventHubs = require('azure-event-hubs');
const EventHubClient = AzureEventHubs.EventHubClient;

const bodyKey = 'body';

const configSelector = 'eventHub';
const configEventHubNameSelector = 'eventHubName';
const configConnectionStringSelector = 'connectionString';

const eventList = require('./../event-list');
const eventListData = eventList.Data;
const eventNameKey = eventListData.EVENT_NAME;
const eventDataKey = eventListData.EVENT_DATA;

const fileSystem = require('fs');

var client = null;
var clientName = "undefined";
var lastEvent = -1;
var lastEventFile = './.last';
var receiver = null;
var version = {};

module.exports = 
{
    'configure':
    function configure(config, packageInfo) {
        if (configSelector in config) {
            const eventHubConfig = config[configSelector];
            if (!configConnectionStringSelector in eventHubConfig) throw 'No connectionString in EventHub config';
            if (!configEventHubNameSelector in eventHubConfig) throw 'No eventHubName in EventHub config';
            const eventHubName = eventHubConfig[configEventHubNameSelector]
            const connectionString = eventHubConfig[configConnectionStringSelector];
            client = EventHubClient.createFromConnectionString(connectionString, eventHubName);
        } else {
            // No EventHub configuration found in config
            throw 'No configuration for EventHub was found!'
        }
        if ('name' in packageInfo && 'version' in packageInfo) {
            clientName = packageInfo.name;
            var tmp = packageInfo.version.split('.');
            version[eventListData.VERSION_RELEASE] = tmp[0];
            version[eventListData.VERSION_PATCH] = tmp[1];
            version[eventListData.VERSION_HOTFIX] = tmp[2];
        } else {
            throw 'No package info was found!';
        }
        try {
            if (fileSystem.readFile(lastEventFile, 'utf8', (err, data) => {
                const file = parseInt(data);
                if (!!file) {
                    lastEvent = file;
                }
            }));
        } catch (e) { console.log(e); }
    },
    'send': 
    function send(name, data, previousEvent) {
        requireConfigure()
        var body = {}
        body[eventNameKey] = name;
        body[eventDataKey] = (!!data ? data : {});
        body[eventDataKey][eventListData.SENDER] = clientName;
        if (!!previousEvent && !!previousEvent.length) {  
            body[eventDataKey][eventListData.PREVIOUS_EVENT] = previousEvent;
        }
        const message = {};
        message[bodyKey] = body;
        return client.send(message, partitionId);
    },
    'start': 
    function start(onEvent) {
        requireConfigure()
        const onError = function(error) {
            console.log('Error: ' + error)
        }
        const onMessage = function(message) {
            try {
                const time = parseInt(message['annotations']['x-opt-enqueued-time']);
                if (time > lastEvent) {
                    lastEvent = time;
                    saveLastEvent(time);
                    const body = message[bodyKey];
                    if (body != null && eventNameKey in body) {
                        var name = body[eventNameKey];
                        var data = body[eventDataKey];
                        if (name === eventList.STATUS_REQUEST) {
                            sendStatusResponse(body);
                        }
                        if (name === eventList.VERSION_REQUEST) {
                            sendVersionResponse(body);
                        }
                        onEvent(name, data, time);
                    }
                }   
            } catch (e) { 
                onError(e);
             }
        }
        receiver = client.receive(partitionId, onMessage, onError);
    },
    
    'stop':
    function stop() {
        requireConfigure();
        if (receiver) {
            receiver.stop();
        }
    }
}

function requireConfigure() {
    if (!client) throw Error('Call configure before start');
}

function saveLastEvent(timeUnix) {
    fileSystem.writeFile(lastEventFile, timeUnix, 'utf8', (err) => {
        if (err) throw err;
    });
}

function sendStatusResponse(previousEvent) {
    data = {};
    data[eventListData.STATUS_CODE] = eventListData.STATUS_CODES.OK;
    module.exports.send(eventList.STATUS_RESPONSE, data, previousEvent);
}

function sendVersionResponse(previousEvent) {
    data = JSON.parse(JSON.stringify(version));
    module.exports.send(eventList.VERSION_RESPONSE, data, previousEvent).catch((reason) => {
        console.log(reason);
    });
}