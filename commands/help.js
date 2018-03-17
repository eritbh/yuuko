'use strict'

const Command = require('../src/Command')

/**
 * Returns the help text for a command.
 * @param {string} prefix - The prefix to use when generating the text. Used
 * in usage examples within the returned text.
 * @returns {string}
 */
function helpText (command, prefix) {
	let txt = ''
	if (command.help.desc) txt += `**Description:** ${command.help.desc}\n`
	if (command.help.args) txt += `**Usage:** \`${prefix}${command.name} ${command.help.args}\`\n`
	if (command.aliases.length) txt += `**Aliases:** ${command.aliases.map(p => '`' + prefix + p + '`').join(', ')}\n`
	return txt
}

module.exports = new Command(['help', 'man', 'h', null], function (msg, args, prefix) {
	// If the prefix is a mention of the bot, use a blank string instead so our
	// command list output is less terrible
	if (prefix.match(this.mentionPrefixRegExp)) prefix = ''

	// If we got nothing, command list
	if (!args[0]) {
		const commandList = this.commands.filter(c => c.help).map(c => '`' + prefix + c.name + '`').join(', ')
		return msg.channel.createMessage(`**=== Help: Command List ===**
You can use the following commands: ${commandList}
Use \`${prefix}help [command]\` to get more info on that command!`)
	}

	// Find the command we're talking about
	let command = this.commandForName(args[0])
	// If this command doesn't exist or isn't documented, tell the user
	if (!command || !command.help) {
		msg.channel.createMessage(`**=== Help: Unknown Command ===**\nMake sure you spelled the command name right, and that this bot has it. Do \`${prefix}help\` with no arguments to see a list of commands.`)
		return
	}
	msg.channel.createMessage(`**=== Help: \`${prefix + command.name}\` ===**\n${helpText(command, prefix)}`)
}, {
	desc: 'Get a list of commands. Pass a command name as an argument to get information about that command.',
	args: '[command]'
})
