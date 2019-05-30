const path = require('path');
const {Client} = require('yuuko');

const mybot = new Client({
	token: 'feed_me_credentials',
	prefix: '!',
});

mybot.addCommandDir(path.join(__dirname, 'commands')).connect();
