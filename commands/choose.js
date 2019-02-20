'use strict';

const {Command} = require('../src/Command');

module.exports = new Command(['choose', 'c'], async (msg, args) => {
	const options = args.join(' ') // Add spaces back into the string
		.split('').reverse().join('') // Reverse the string
		.split(/\s*,(?!\\)\s*/g) // Split on non-escaped commas, and consume any whitespace before or after
		.filter(o => !o.match(/^\s*$/)) // Remove whitespace-only entries
		.map(o => o.split('').reverse().join('')); // Flip each entry around again so they're the right way (the array is backwards but it doesn't matter)

	const option = options[~~(Math.random() * options.length)]; // Pick an option at random from the list of entries
	try {
		await msg.channel.createMessage(`I choose: **${option}**`); // Reply with the option
	} catch (_) {
		// blocked message things, w/e
	}
});
module.exports.help = {
	desc: 'Choose a random option from a list. If you want to include a comma in an option, escape it with a backslash.',
	args: '<option>, <option>, [options ...]',
};
