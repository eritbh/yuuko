'use strict';

const Command = require('../src/Command');
const d20 = require('d20');

module.exports = new Command(['roll', 'r'], async function (msg, args) {
	if (!args.length) {
		args[0] = '1d6';
	}
	const response = args.map(roll => {
		if (!roll) return;
		roll = roll
			.replace(/^(\d+)(?!d)/, 'd$1')
			.replace(/^d/, '1d')
			.replace('d%', 'd100');
		let result;
		try {
			result = d20.roll(roll);
		} catch (e) {
			result = 0;
		}
		return `**\`\`${roll}\`\`** > **${result}**`;
	}).filter(r => r).join('\n');
	msg.channel.createMessage(response).catch(() => {});
});
module.exports.help = {
	desc: 'Roll some dice. Pass in a number or an `AdX` roll, with modifiers and `d%` format supported. Examples: `6`, `2d20`, `1d%`, `d4-2`. If no roll is specified, it will default to `1d6`. Pass in multiple rolls by separating them with spaces.',
	args: '<rolls>'
};
