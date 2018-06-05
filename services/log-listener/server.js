
const { fork } = require('child_process');

const config = require('./config.json');
const eventHub = require('event-hub');
const events = require('event-list');
const logger = require('./logger');
const eventDataList = events.Data;

function onEvent(name, data, time) {
    const process = fork('./logger.js');
    process.send({name: name, data: data, time: time});
}

eventHub.configure(config, require('./package.json'));
eventHub.start(onEvent);
console.log("Application running!");