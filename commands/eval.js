'use strict';

const {Command} = require('../src/Command');
const superagent = require('superagent');

const codeBlockRegExp = /^[\s\n]*```((javascript|js|ruby|rb|python|py)?\n)?([\S\s]*)\n?```[\s\n]*$/;
const inlineCodeRegExp = /^[\s\n]*(``?)(.*)\1[\s\n]*$/;

function urlPartForLang (lang) {
	switch (lang) {
		case 'javascript':
		case 'js':
			return 'https://hook.io/geo1088/js-eval?code=';
		case 'ruby':
		case 'rb':
			return 'https://hook.io/geo1088/ruby-eval?code=';
		case 'python':
		case 'py':
			return 'https://hook.io/geo1088/py-exec-then-eval?code=';
		default:
			return null;
	}
}

module.exports = new Command([
	'eval',
	'javascript',
	'js',
	'ruby',
	'rb',
	'python',
	'py',
], async (msg, args, {commandName}) => {
	let code = args.join(' ');
	let codeBlockLang;
	let match;
	if ((match = code.match(codeBlockRegExp))) {
		code = match[3];
		codeBlockLang = match[2];
	} else if ((match = code.match(inlineCodeRegExp))) {
		code = match[2];
	}

	let url = urlPartForLang(commandName);
	if (!url) url = urlPartForLang(codeBlockLang);
	if (!url) {
		msg.channel.createMessage("Couldn't detect language.");
		return;
	}
	url += encodeURIComponent(code);
	try {
		msg.channel.sendTyping();
		const res = await superagent.get(url);
		msg.channel.createMessage(res.text).catch(() => {});
	} catch (err) {
		msg.channel.createMessage(`${err}`).catch(() => {});
	}
});
module.exports.help = {
	desc: `Evaluates arbitrary code in a third-party sandbox. Supports multiple languages; to specify a language, use a language-specific alias or a code block tagged with the desired language.
For example:
\`\`\`
eval \`\u200b\`\u200b\`ruby
puts "hello"
\`\u200b\`\u200b\`
\`\`\`
and
\`\`\`
rb puts "hello"
\`\`\`
are both valid and will evaluate as Ruby code. Supported languages are Ruby (\`ruby\`, \`rb\`), Python (\`python\`, \`py\`), and Javascript (\`javascript\`, \`js\`).`,
};
