'use strict'

const Command = require('../src/Command')

module.exports = new Command('reload', function (msg) {
	msg.channel.sendTyping()
	setTimeout(() => { // Delay by 100ms to make sure the sendTyping arrives first
		this.reloadCommands()
		msg.channel.createMessage('Reloaded commands.')
	}, 100)
}, {
	owner: true
})
