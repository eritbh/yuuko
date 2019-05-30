const {Command} = require('yuuko');
module.exports = new Command('two', message => {
	message.channel.createMessage('Command two works!');
});
