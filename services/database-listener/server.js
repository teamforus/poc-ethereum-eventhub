
const listenerId = 'database-listener';
const release = 0;
const patch = 1;
const hotfix = 0;

const config = require('./config.json');
var databaseDirectory = null;
const eventHub = require('event-hub');
const events = require('event-list');
const dataList = events.Data;
const fs = require('fs');
const tables = require('./directories');

function asureTableExists(table) {
    directory = databaseDirectory + '/' + table + '/';
    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory);
    }
    return directory;
}

function doesExist(table, address) {
    directory = asureTableExists(table);
    var fileName = directory + address + '.json'
    return (fs.existsSync(fileName));
}

function getTableData(table, address) {
    if (doesExist(table, address)) {
        fileName = databaseDirectory + '/' + table + '/' + address + '.json'
        const file = fs.readFileSync(fileName).toString('utf8');
        try {
            return JSON.parse(file);
        } finally{}
    }
    return null;
}

function getBalance(user, tokenAddress) {
    try { 
        user = JSON.parse(user);
    } catch(error) {
        if (doesExist(tables.USERS, user)) {
            user = getTableData(table, user);
        } else return null;
    }
    // User will guarenteed always be a json user object
    if (!!user['wallets'] && !!user['wallets'][tokenAddress]) {
        return user.wallet[tokenAddress];
    }
    else return 0; //TODO determine if 0 or -1 is required
}

function handleRequestTransferEvent(data) {
    const amount = data[dataList.AMOUNT];
    if (amount <= 0) return 'amount must be greater than 0';
    const fromAddress = "0xb8918494b24862b2b9dc7cc2c3e9a41893d8d4b6";// TODO fix this data[dataList.SENDER];
    const toAddress = data[dataList.TO];
    const tokenAddress = data[dataList.TOKEN];
    var from = getTableData(tables.USERS, fromAddress);
    var to = getTableData(tables.USERS, toAddress);
    var token = getTableData(tables.TOKENS, tokenAddress);
    if (!from) {
        return 'user does not exists. Cannot transfer from unknown account.' + fromAddress;
    } else if (!to) {
        to = {}
        to['address'] = toAddress;
    } else if (!token){
        return 'token does not exist';
    } 
    var fromWallet = from['wallet'];
    if (fromWallet[tokenAddress] < amount) {
        return 'insufficient funds';
    }
    fromWallet[tokenAddress] -= amount;
    from['wallet'] = fromWallet;
    var toWallet = to['wallet'];
    if (!!toWallet) {
        toWallet[tokenAddress] = (!!toWallet[tokenAddress] ? toWallet[tokenAddress] + amount : amount);
    } else {
        toWallet = {};
        toWallet[tokenAddress] = amount;
    }
    to['wallet'] = toWallet;
    if (saveUser(from)) {
        if (saveUser(to)) {
            return true;
        }
    }
    return 'could not save user';
}

function onEvent(eventName, eventData, time) {
    try {
        switch (eventName) {
            case events.ERC20_TRANSFER_REQUEST: 
                const success = handleRequestTransferEvent(eventData);
                const previous = {};
                previous[dataList.EVENT_DATA] = eventData;
                previous[dataList.EVENT_NAME] = events.ERC20_TRANSFER_REQUEST;
                if (success === true) {
                    eventHub.send(events.ERC20_TRANSFER_SAVED, eventData, previous);
                } else {
                    eventHub.send(events.ERC20_TRANSFER_FAILED, {message: success},  previous);
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
        data[dataList.TO] = "0x585a36b6a2ae6a0184ea868e3bc0517bf2fd8fa5";
        data[dataList.AMOUNT] = 100;
        data[dataList.TOKEN] =  "0x7fda2776f3106322fa5acc4b85092ce3eea38e1d";
        data[dataList.SENDER] = "0xb8918494b24862b2b9dc7cc2c3e9a41893d8d4b6"
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

function saveUser(userJson) {
    if (!!userJson.address) {
        try {
            const directory = asureTableExists(tables.USERS);
            fs.writeFileSync(directory + userJson.address + '.json', JSON.stringify(userJson), 'utf8');
            return true;
        } catch (error) {}
    } 
    return false;
}

function setupDatabase(config) {
    try {
        databaseDirectory = __dirname + '/' + config['database']['directory'];
        if (!fs.existsSync(databaseDirectory)) fs.mkdirSync(databaseDirectory);
    } catch(error) {
        throw error;
    }
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