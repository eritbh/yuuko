const {Command} = require('../src/Yuuko')
const request = require('request')

const codeBlockRegExp = /^[\s\n]*```((javascript|js|ruby|rb)?\n)?([\S\s]*)\n?```[\s\n]*$/
const inlineCodeRegExp = /^[\s\n]*(``?)(.*)\1[\s\n]*$/

function urlPartForLang (lang) {
	switch (lang) {
		case 'javascript':
		case 'js':
			return 'https://hook.io/geo1088/js-eval?code='
		case 'ruby':
		case 'rb':
			return 'https://hook.io/geo1088/ruby-eval?code='
	}
}

module.exports = new Command(['eval', 'javascript', 'js', 'ruby', 'rb'], function (msg, args, prefix, commandName) {
	let code = args.join(' ')
	let codeBlockLang
	let match
	if ((match = code.match(codeBlockRegExp))) {
		code = match[3]
		codeBlockLang = match[2]
	} else if ((match = code.match(inlineCodeRegExp))) {
		code = match[2]
	}
	console.log(codeBlockLang, code)

	let url = urlPartForLang(commandName)
	if (!url) url = urlPartForLang(codeBlockLang)
	if (!url) {
		msg.channel.createMessage("Couldn't detect language.")
		return
	}
	url += encodeURIComponent(code)

	console.log(url)

	request(url, (err, res, body) => {
		let response
		if (err) response = '' + err
		else response = body
		msg.channel.createMessage(`\`\`\`\n${response}\n\`\`\``).catch(console.log)
	})
})

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
are both valid and will evaluate as Ruby code. Supported languages are Ruby (\`ruby\`, \`rb\`) and Javascript (\`javascript\`, \`js\`).`
}