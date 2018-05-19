'use strict'

const Command = require('../src/Command')

module.exports = new Command('setname', async function (msg, args) {
	try {
		msg.channel.sendTyping()
		await this.editSelf({username: args.join(' ')})
		await msg.channel.createMessage('Username updated!')
	} catch (err) {
		msg.channel.createMessage('There was an error while changing username.\n```\n' + err.message + '\n```').catch(() => {})
	}
}, {
	owner: true
})
