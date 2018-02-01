'use strict'

const Command = require('../src/Command')
const util = require('util')

const inspectOptions = {
	depth: 1
}

module.exports = new Command('debug', function (msg, args, prefix, commandName) {
	this.getOAuthApplication().then(app => {
		if (app.owner.id !== msg.author.id) {
			return msg.channel.createMessage("You're not my dad.")
		}

		// Parse out code blocks
		args = args.join(' ').replace(/^\s+/, '').replace(/\s*$/, '')
		if (args.startsWith('```') && args.endsWith('```')) {
			args = args.substring(3, args.length - 3)
			if (args.startsWith('js')) {
				args = args.substr(2)
			}
		}

		// Create a dummy console object
		const c = {
			_lines: [],
			_logger (...things) {
				this._lines.push(...things.join(' ').split('\n'))
			},
			_formatLines () {
				return this._lines.map(line => line && `//> ${line}\n`).join('')
			}
		}
		c.log = c.error = c.warn = c.info = c._logger

		// Do some weird shit here because why not
		let result
		try {
			result = eval(args) // eslint-disable-line no-eval
		} catch (e) {
			result = e
		}
		const message = '```js\n' + c._formatLines() + util.inspect(result, inspectOptions) + '\n```'

		const messagePromise = msg.channel.createMessage(message).catch(err => {
			msg.channel.createMessage('Error sending message:\n```\n' + err + '\n```')
		})

		// We returned a promise?
		if (result && typeof result.then === 'function') {
			// Sweet. Wait for that to resolve and the message to send.
			Promise.all([messagePromise, result]).then(([outputMsg, value]) => {
				// Now we can edit the message with the promise's resolved result(s).
				value = util.inspect(value, inspectOptions)
				const newContent = outputMsg.content.split('\n')
				newContent.splice(newContent.length - 1, 0, `// Resolved to:`, value)
				outputMsg.edit(newContent.join('\n'))
			}, err => {
				console.log(err)
			})
		}
	}).catch(e => {
		console.log(e)
	})
})
