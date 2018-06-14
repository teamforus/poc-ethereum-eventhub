
var contract = null;
var web3 = null;
var sender = null;
var senderPassword = null;
module.exports = {
    'init': (_web3, config) => {
        const address = config['ethereum']['helloWorldAddress'];
        sender = config['ethereum']['coinbaseAddress'];
        senderPassword = config['ethereum']['coinbasePassword'];
        web3 = _web3;
        contract = new web3.eth.Contract(
            // ABI
            [{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"by","type":"string"},{"indexed":false,"name":"newMessage","type":"string"}],"name":"MessageSet","type":"event"},{"constant":true,"inputs":[],"name":"getMessage","outputs":[{"name":"message","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"by","type":"string"},{"name":"message","type":"string"}],"name":"setMessage","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}],
            // address
            address,
            // something null
            null
        );
    },

    'getMessage': () => {
        const method = contract.methods.getMessage();
        const address = contract._address;
        return web3.eth.call({
            to: address,
            data: method.encodeABI()
        }).then((result) => {
            //result = web3.utils.toAscii(result);
            result = (web3.utils.hexToAscii(result));
            return result;
        }).catch((error) => {
            console.error('Error! '  + error);
            return error;  
        });
    },

    'setMessage': (who, message) => {
        web3.eth.personal.unlockAccount(sender, senderPassword, 750).then((unlocked) => {        
            const method = contract.methods.setMessage(who, message);
            const transaction = {
                from: sender,
                to: contract._address,
                value: 0,
                gas: 4700000,
                gasPrice: 0,
                chainId: 1492,
                data: method.encodeABI()
            };
           web3.eth.sendTransaction(transaction).catch((error) => {
                throw error;  
           }); 
        }).catch((error) => {
            console.error(error);
        });
    }
}