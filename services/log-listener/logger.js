
const fs = require('fs');

process.on('message', async (event) => {
    const name = event.name;
    const data = event.data;
    const time = event.time;
    const date = new Date(time);
    var directory = __dirname + '/logs/';
    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory);
    }
    directory +=  date.getFullYear() + '-' + 
            (date.getMonth() < 10? '0' : '') + date.getMonth() + '-' + 
            (date.getDate() < 10? '0': '') + date.getDate() + '/'
    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory);
    }
    var file = (date.getHours() < 10? '0' : '') + date.getHours() + "_" + 
            (date.getMinutes() < 10? '0' : '') + date.getMinutes() + '_' + 
            (date.getSeconds() < 10? '0' : '') + date.getSeconds() + 
            (date.getMilliseconds() < 10? '0' : '' ) + (date.getMilliseconds() < 100? '0' : '') + date.getMilliseconds() + '-' + name + '.log';
    fs.writeFileSync(directory + file, JSON.stringify(event), 'utf8');
})