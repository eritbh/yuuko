'use strict'

module.exports = function (minLevel) {
	const util = require('util')
	let chalk
	try {
		chalk = require('chalk')
	} catch (e) {
		// Chalk isn't installed, that's fine
		// We'll create a thing that looks like chalk but really isn't
		chalk = text => text
		const codes = [ // Only the ones we actually use
			'bgRed',
			'green',
			'bgYellow',
			'cyan',
			'gray',
			'black',
			'white'
		]
		for (let code of codes) {
			chalk[code] = chalk
		}
	}

	const logs = {
		debug: {level: 0, text: 'dbug', style: chalk.white},
		info: {level: 1, text: 'info', style: chalk.cyan},
		ok: {level: 2, text: ' ok ', style: chalk.green},
		warn: {level: 3, text: 'warn', style: chalk.black.bgYellow},
		error: {level: 4, text: 'err!', style: chalk.white.bgRed}
	}

	chalk._log = function (...things) {
		let str = ''
		for (let thing of things) {
			if (typeof thing === 'string') {
				str += thing + ' '
			} else {
				let inspected = util.inspect(thing, {colors: true})
				str += inspected + ' '
			}
		}
		console.log(str.replace(/\n/g, '\n  '))
	}
	chalk.timestamp = function (text) {
		const timestamp = new Date().toISOString().replace('T', ' ').replace(/\..*/, '')
		return chalk.gray(`[${timestamp} ${text}]`)
	}
	for (let log of Object.keys(logs)) {
		const {level, text, style} = logs[log]
		if (minLevel > level) {
			chalk[log] = function () {}
		} else {
			chalk[log] = function (...things) {
				this._log(this.timestamp(style(text)), ...things)
			}
		}
	}

	return chalk
}
