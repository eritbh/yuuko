/** @module Yuuko */

import {Command} from '../Yuuko';
import * as util from 'util';

const inspectOptions = {
	depth: 1,
};

// eslint-disable-next-line
export default new Command('debug', async function debug (msg, args, ctx) {
	// Parse out code blocks
	let string = args.join(' ').replace(/^\s+/, '').replace(/\s*$/, '');
	if (string.startsWith('```') && string.endsWith('```')) {
		string = string.substring(3, string.length - 3);
		if (string.startsWith('js')) {
			string = string.substr(2);
		}
		if (string.startsWith('javascript')) {
			string = string.substr(10);
		}
	}

	// Create a dummy console object
	const console: any = { // dynamic assignment wooooo
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

	// Convenience variables exposed to eval
	/* eslint-disable */
	const c = console;
	const message = msg;
	const context = ctx;
	const {client, prefix, commandName} = ctx;
	/* eslint-enable */

	// Eval the things and send the results
	let result;
	try {
		result = eval(string); // eslint-disable-line no-eval
	} catch (e) {
		result = e;
	}
	const outputText = `\`\`\`js\n${console._formatLines()}${util.inspect(result, inspectOptions)}\n\`\`\``;

	// Send the message
	let outputMsg;
	try {
		outputMsg = await msg.channel.createMessage(outputText);
	} catch (err) {
		try {
			msg.channel.createMessage(`Error sending message:\n\`\`\`\n${err}\n\`\`\``);
		} catch {
			// pass
		}
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
