
'use strict';
// eslint-disable no-console

const util = require('util');
const inspectOptions = {depth: 1};

module.exports = hook => {
	// Override console object for logging stuff
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
	console.log = console.error = console.warn = console.info = console._logger;

	// Get the eval result
	let result;
	try {
		result = eval(hook.params.code || ''); // eslint-disable-line no-eval
	} catch (e) {
		result = e;
	}

	// Format the result
	const message = `\`\`\`js\n${console._formatLines()}${util.inspect(result, inspectOptions)}\n\`\`\``;
	hook.res.end(message);
};
