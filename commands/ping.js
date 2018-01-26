'use strict'

const Command = require('../src/Command')

module.exports = new Command('ping', function (msg) {
	const then = Date.now()
	msg.channel.createMessage("I'm here.").then(newmsg => {
		const diff = Date.now() - then
		newmsg.edit(`${newmsg.content} (${diff}ms)`)
	})
})
module.exports.help = {
	desc: 'Pings the bot.',
	args: ''
}
