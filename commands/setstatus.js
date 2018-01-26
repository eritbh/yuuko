'use strict'

const Command = require('../src/Command')

module.exports = new Command(['setstatus', 'setgame'], function (msg, args) {
	this.getOAuthApplication().then(app => {
		if (app.owner.id !== msg.author.id) {
			return msg.channel.createMessage("You're not my dad.")
		}
		let status = args.splice(0, 1)[0]
		switch (status) {
		case 'dnd':
		case 'red':
			status = 'dnd'
			break
		case 'idle':
		case 'yellow':
			status = 'idle'
			break
		case 'invisible':
		case 'invis':
		case 'grey':
		case 'none':
			status = 'invisible'
			break
		case 'online':
		case 'green':
			status = 'online'
			break
		default:
			args.splice(0, 0, status)
			status = 'online'
		}
		const game = args.join(' ')
		this.editStatus(status, game ? {name: game} : undefined)
	})
})
