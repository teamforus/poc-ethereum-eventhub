
const config = require('./config.json');
const Web3 = require('web3');
const web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider(config['ethereum']['connectionString']));
const helloWorldHelper = require('./hello-world-contract');
helloWorldHelper.init(web3, config);
const express = require('express');
var app = express();

app.get('/message/get', (request, response) => {
    helloWorldHelper.getMessage().then((message) => {
        //console.log(message.replace(RegExp('(\\u00..)+'), ''));
        response.send({body: message}); 
    }).catch((error) => {
        console.error(error);
        response.send({error: error});  
    });
});

app.use(express.json());

app.post('/message/set', (request, response) => {
    const name = request.body['name'];
    const message = request.body['message'];
    if (!!name && !!message) {
        helloWorldHelper.setMessage(name, message);
        response.send({body: 'Transaction handled, me thinks.', success: true});
    } else {
        response.send({success: false});
    }
});
app.listen(3000);
console.log('App ready at 3000');