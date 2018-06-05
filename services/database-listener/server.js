
const listenerId = 'database-listener';
const release = 0;
const patch = 1;
const hotfix = 0;

const config = require('./config.json');
const sqlite3 = require('sqlite3').verbose();
var database = null;
const eventHub = require('event-hub');
const events = require('event-list');
const dataList = events.Data;

function onEvent(eventName, eventData, time) {
    try {
        switch (eventName) {
            case events.ERC20_TRANSFER_REQUEST: 
                const success = handleRequestTransferEvent(eventData);
                const previous = {};
                previous[dataList.EVENT_DATA] = eventData;
                previous[dataList.EVENT_NAME] = events.ERC20_TRANSFER_REQUEST;
                if (!!success) {
                    eventHub.send(events.ERC20_TRANSFER_SAVED, eventData, previous);
                } else {
                    eventHub.send(events.ERC20_TRANSFER_FAILED, null, previous);
                }
                break;
            case events.ERC20_TRANSFER_SAVED: 
                console.log("Test was successful!");
                break;
            case events.ERC20_TRANSFER_FAILED:
                console.log("Test failed");
                break;
        }
    } catch (error) {
        console.log(error);
    }
}

function onInput(i) {
    const input = i.toString().trim().toLowerCase();
    if (input == 'help') {
        console.log('Sorry, but I hope you weren\'t desperate. There is no help implemented yet. Have fun');
    }
    else if (input == 'stop') {
        console.log('Stopping server...');
        eventHub.stop();
        console.log('Server shut down. Have a nice day :)');
        throw 'This should be done neater, but the server is now closed.'
    } else if (input === 'test') {
        console.log('Test started...');
        const data = {};
        data[dataList.TO] = 103;
        data[dataList.AMOUNT] = 101;
        data[dataList.TOKEN] = 201;
        eventHub.send(events.ERC20_TRANSFER_REQUEST, data);
        console.log('Event for test sent... awaiting response.');
    }
    else if (input === 'version') {
        console.log('Sending event to hub...')
        eventHub.send(events.VERSION_REQUEST).catch((reason) => {
            console.log(reason);
        });
    } else {
        console.log('Unknown command. Try something that might work.');
    }
}

function handleRequestTransferEvent(data) {
    const fromToken = data[dataList.SENDER];
    const toId = data[dataList.TO];
    const amount = data[dataList.AMOUNT];
    const tokenId = data[dataList.TOKEN];
    var from = null;
    var to = null;
    var token = null;
    database.each('SELECT * from `user` WHERE `token` = ? OR `id` = ?', [fromToken, toId], (err, row) => {
          if (row.id === toId) to = row;
          else if (row.token === fromToken) from = row; 
    });
    database().get('SELECT * FROM `token` WHERE `id` = ?', [tokenId], (error, row) => {
        token = row;
    });
    if (!!from && !!to && !!token && amount > 0) {
        var wallet = database().queryFirstRow('SELECT * FROM `wallet` WHERE `user_id` = ?', from.id);
        if (!!wallet && wallet.amount >= amount) {
            wallet.amount -= amount;
            database().update('wallet', {
                id: wallet.id
            }, {
                amount: wallet.amount
            });
            wallet = database().queryFirstRow('SELECT * FROM `wallet` WHERE `user_id` = ?', to.id);
            if (!!wallet) {
                database().update('wallet', {
                    id: wallet.id
                }, {
                    amount: wallet.amount
                });
            } else {
                database().insert('wallet', {
                    user_id: to.id,
                    amount: amount,
                    token_id: tokenId
                });
            }
            return true;
        }
    }
    return false;
}

function setupDatabase(config) {
    const filename = __dirname + '/database.sql';
    const fs = require('fs');
    const exists = fs.existsSync(filename)
    database = new sqlite3.Database(filename);
    database.serialize(() => {
        if (!exists) {
            const migrationFileName = __dirname + '/migrations/001-init.sql';
            fs.readFile(migrationFileName, 'utf8', (err, data) => {
                database.run(data);
            });
        }
    });
}

// Start actual process
console.log ("Setting up database...");
setupDatabase(config);
console.log ("Database ready!");
console.log("Connecting to event hub...");
eventHub.configure(config, require('./package.json'));
eventHub.start(onEvent);
console.log('Server ready. Now listening for commands...');
console.log('Type "help" for help.');
const consoleInput = process.openStdin();
consoleInput.addListener('data', onInput);