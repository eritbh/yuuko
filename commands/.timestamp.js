// TODO: This file is incomplete.

'use strict'

const Command = require('../src/Command')
const moment = require('moment')

module.exports = new Command(['timestamp', 'ts'], function (msg, args) {
	const input = parseInt(args[0], 10)

	let dateObject

	if (!isNaN(input)) {
		let format = args[1]
		let isMillis = ~~(input / 10 ** 12)
		if (isMillis) {
			date = moment.utc(input)
			inputFormat = 'milliseconds'
		} else {
			dateObject = moment.utc(input * 1000)
			inputFormat = 'seconds'
		}
	} else {

	}

	let inputFormat
	let timestampMillis = 0

	if (isNaN(input)) {
		timestampMillis = Date.now()
	} else {
		// TODO: ??
	}
	let timestampSeconds = ~~(timestampMillis / 1000)

	const dateString = moment.utc(timestampMillis).format('YYYY-MM-DD HH:mm:ss [UTC]')

	const responseText = `**${dateString}**
In milliseconds: ${timestampMillis}
In seconds: ${timestampSeconds}
${inputFormat ? `(Assuming input in ${inputFormat}.)` : ''}`

	msg.channel.createMessage(responseText)
})
