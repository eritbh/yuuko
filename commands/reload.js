'use strict'

const Command = require('../src/Command')

module.exports = new Command('reload', function (msg) {
	msg.channel.sendTyping()
	this.reloadCommands()
	msg.channel.createMessage('Reloaded commands.')
}, {
	owner: true
})
