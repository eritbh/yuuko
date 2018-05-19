'use strict'

const Command = require('../src/Command')

module.exports = new Command('ping', async function (msg) {
	const then = Date.now()
	try {
		const newmsg = await msg.channel.createMessage("I'm here.")
		const diff = Date.now() - then
		await newmsg.edit(`${newmsg.content} (${diff}ms)`)
	} catch (_) {} // Missing permissions, we don't need to worry here
})
module.exports.help = {
	desc: 'Pings the bot.',
	args: ''
}
