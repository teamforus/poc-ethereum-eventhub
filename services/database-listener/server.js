
const listenerId = 'database-listener';
const release = 0;
const patch = 1;
const hotfix = 0;

const config = require('./config.json');
const eventHub = require('event-hub');
const events = require('event-list');
const dataList = events.Data;

function onEvent(eventName, eventData, time) {
    try {
        switch (eventName) {
            case events.STATUS_REQUEST:
                var data = {}
                data[events.STATUS_CODE] = events.STATUS_CODES.OK
                eventHub.send(events.STATUS, data);
                break;
            case events.STATUS_RESPONSE:
            case events.VERSION_RESPONSE:
                console.log(eventData);
                break;
            case events.VERSION_REQUEST:
                /*const previous = {};
                previous
                data = {}
                data[dataList.VERSION_RELEASE] = release;
                data[dataList.VERSION_PATCH] = patch;
                data[dataList.VERSION_HOTFIX] = hotfix; 
                eventHub.send(events.VERSION_RESPONSE, data).catch((reason) => {
                    console.log(reason);
                });*/
        }
    } catch (error) {
        console.log(error);
    }
}

function onInput(i) {
    const input = i.toString().trim().toLowerCase()
    if (input == 'help') {
        console.log('Sorry, but I hope you weren\'t desperate. There is no help implemented yet. Have fun');
    }
    else if (input == 'stop') {
        console.log('Stopping server...');
        eventHub.stop();
        console.log('Server shut down. Have a nice day :)');
        throw 'This should be done neater, but the server is now closed.'
    }
    else if (input === 'version') {
        console.log('Sending event to hub...')
        eventHub.send(events.VERSION_REQUEST).catch((reason) => {
            console.log(reason);
        });
    } else {
        console.log('Unknown command. Try something that might work.')
    }
}

// Start actual process
eventHub.configure(config, require('./package.json'));
eventHub.start(onEvent);
console.log('Server ready. Now listing for commands...');
console.log('Type "help" for help.')
const consoleInput = process.openStdin();
consoleInput.addListener('data', onInput);