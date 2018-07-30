
const BigNumber = require('bignumber.js');
const config = require('./config.json');
const eventHub = require('event-hub');
const eventList = require('event-list');
const eventDataList = eventList.Data;
var web3 = null;

async function balanceOf(tokenAddress, account) {
    const token = setupTokenContract(tokenAddress)
    return web3.eth.call({
        to: tokenAddress,
        data: token.methods.balanceOf(account).encodeABI()
    }).then((balanceHex) => {
        console.log('Balance of "' + account + '" = ' + balanceHex);
        if (balanceHex === '0x') return 0;
        return BigNumber(balanceHex.toString()); 
    });;
    /*const method = tokenContract.methods.balanceOf(account);
    const balance = await method.call();
    return balance;*/
}

function onEvent(eventName, eventData, time) {
    try {
        switch (eventName) {
            case eventList.ERC20_TRANSFER_REQUEST:
                const transaction = eventData['rawTransaction'];
                (async () => {
                    const previous = {};
                    previous[eventDataList.EVENT_NAME] = eventName;
                    previous[eventDataList.EVENT_DATA] = eventData;
                    const receipt = await web3.eth.sendSignedTransaction(transaction);
                    if (!!receipt && !!receipt.status) {
                        eventHub.send(eventList.ERC20_TRANSFER_EXECUTED, {transactionHash: receipt.transactionHash}, previous);
                    } else {
                        eventHub.send(eventList.ERC20_TRANSFER_FAILED, {message: 'failed to make transaction'}, previous);
                    }
                })();
                break;
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
    } else {
        console.log('Unknown command. Try something that might work.')
    }
}

function setupTokenContract(address) {
    return new web3.eth.Contract(
        [{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"name","type":"string"},{"name":"totalSupply","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"tokens","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"tokenOwner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"tokens","type":"uint256"}],"name":"Approval","type":"event"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"tokenOwner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"tokenOwner","type":"address"},{"name":"spender","type":"address"}],"name":"allowance","outputs":[{"name":"remaining","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"to","type":"address"},{"name":"tokens","type":"uint256"}],"name":"transfer","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"spender","type":"address"},{"name":"tokens","type":"uint256"}],"name":"approve","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"from","type":"address"},{"name":"to","type":"address"},{"name":"tokens","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"}],
        address,
        null
    );
}

function setupWeb3(config) {
    const web3ConnectionString = config['web3']['connectionString'];
    const Web3 = require('web3');
    web3 = new Web3();
    web3.setProvider(new web3.providers.HttpProvider(web3ConnectionString));
}

// Start actual process
eventHub.configure(config, require('./package.json'));
eventHub.start(onEvent);
console.log('Setting up web3 connection...');
setupWeb3(config);
console.log('Web3 connection set up!');
console.log('Server ready. Now listing for commands...');
console.log('Type "help" for help.')
const consoleInput = process.openStdin();
consoleInput.addListener('data', onInput);