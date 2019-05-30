const {Command} = require('../../src/Command');

module.exports = new Command('setname', async (msg, args, {client}) => {
	try {
		msg.channel.sendTyping();
		await client.editSelf({username: args.join(' ')});
		await msg.channel.createMessage('Username updated!');
	} catch (err) {
		msg.channel.createMessage(`There was an error while changing username.\n\`\`\`\n${err.message}\n\`\`\``).catch(() => {});
	}
}, {
	owner: true,
});
