'use strict'

const Command = require('../src/Command')

module.exports = new Command('setname', function (msg, args) {
	msg.channel.sendTyping()
	this.editSelf({username: args.join(' ')}).then(() => {
		msg.channel.createMessage('Username updated!')
	}).catch(e => {
		msg.channel.createMessage('There was an error while changing username.\n```\n' + e.message + '\n```')
	})
}, {
	owner: true
})
