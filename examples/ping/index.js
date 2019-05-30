const {Client, Command} = require('yuuko');

// Create our client.
const mybot = new Client({
	token: 'feed_me_credentials',
	prefix: '!',
});

// Create a new command that replies to the user.
const pingCommand = new Command('ping', message => {
	message.channel.createMessage('Pong!');
});

// Add the command to the client and connect to Discord.
mybot.addCommand(pingCommand).connect();
