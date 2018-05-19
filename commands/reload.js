'use strict'

const Command = require('../src/Command')

module.exports = new Command('reload', function (msg) {
	this.getOAuthApplication().then(app => {
		if (app.owner.id !== msg.author.id) {
			return msg.channel.createMessage("You're not my dad.")
		}
		msg.channel.sendTyping()
		setTimeout(() => { // Delay by 100ms to make sure the sendTyping arrives first
			this.reloadCommands()
			msg.channel.createMessage('Reloaded commands.')
		}, 100)
	})
})
