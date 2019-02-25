const {Command} = require('../../src/Command');
const util = require('util');

const inspectOptions = {
	depth: 1,
};

module.exports = new Command('debug', async function debug (msg, args, ctx) {
	// Parse out code blocks
	args = args.join(' ').replace(/^\s+/, '').replace(/\s*$/, '');
	if (args.startsWith('```') && args.endsWith('```')) {
		args = args.substring(3, args.length - 3);
		if (args.startsWith('js')) {
			args = args.substr(2);
		}
	}

	// Create a dummy console object
	const console = {
		_lines: [],
		_logger (...things) {
			this._lines.push(...things.join(' ').split('\n'));
		},
		_formatLines () {
			return this._lines.map(line => line && `//> ${line}\n`).join('');
		},
	};
	// eslint-disable-next-line no-multi-assign
	console.log = console.error = console.warn = console.info = console._logger.bind(console);
	// eslint-disable-next-line no-unused-vars
	const c = console; // Convenience

	// Eval the things and send the results
	let result;
	try {
		result = eval(args); // eslint-disable-line no-eval
	} catch (e) {
		result = e;
	}
	const message = `\`\`\`js\n${console._formatLines()}${util.inspect(result, inspectOptions)}\n\`\`\``;

	// Send the message
	let outputMsg;
	try {
		outputMsg = await msg.channel.createMessage(message);
	} catch (err) {
		msg.channel.createMessage(`Error sending message:\n\`\`\`\n${err}\n\`\`\``).catch(() => {});
		return;
	}

	// We returned a promise?
	if (result && typeof result.then === 'function') {
		// Sweet. Wait for that to resolve.
		let value;
		try {
			value = util.inspect(await result, inspectOptions);
		} catch (err) {
			value = err;
		}
		// Now we can edit the message with the promise's resolved result(s).
		const newContent = outputMsg.content.split('\n');
		newContent.splice(-1, 0, '// Resolved to:', value);
		try {
			await outputMsg.edit(newContent.join('\n'));
		} catch (_) {
			newContent.splice(-2, 1, '(content too long)');
			outputMsg.edit(newContent.join('\n')).catch(() => {});
		}
	}
}, {
	owner: true,
});
