const {Command} = require('yuuko');
module.exports = new Command('one', message => {
	message.channel.createMessage('Command one works!');
});
