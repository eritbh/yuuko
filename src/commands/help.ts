/** @module Yuuko */

import {Command, CommandProcess, CommandRequirements, GuildCommandProcess, PrivateCommandProcess} from '../Yuuko';

/**
 * Returns the help text for a command.
 * @param {Command} command The command to get the help text for.
 * @param {string} displayedCommandName The way the command name is displayed,
 * including prefix and parent commands.
 * @param {string} prefix The prefix to use when generating the text. Used
 * in usage examples within the returned text.
 * @returns {string} The help text.
 */
function helpText (
	command: CommandWithHelp,
	displayedCommandName: string,
	prefix: string,
) {
	if (!command.help) {
		return `No help available for \`${displayedCommandName}\`.`;
	}

	let txt = '';
	if (command.help.desc) txt += `**Description:** ${command.help.desc}\n`;
	if (command.help.args) txt += `**Usage:** \`${displayedCommandName} ${command.help.args}\`\n`;
	const otherNames = command.names.slice(1);
	if (otherNames.length) txt += `**Other names:** ${otherNames.map(p => `\`${prefix}${p}\``).join(', ')}\n`;
	if (command.subcommands.length) txt += `**Subcommands:**\n    ${command.subcommands.map(subcommand => `\`${displayedCommandName} ${subcommand.names[0]}\``).join('\n')}\n`;
	return txt.trim();
}

/**
 * Helper function to emulate the behavior of Array#filter with async functions.
 * Reference: {@link https://stackoverflow.com/a/33401045}
 * @param {Array<*>} array An array of values to filter.
 * @param {*} filter The filter function. The same as a function passed to
 * Array#filter, but resolves to true/false rather than returning true/false.
 * @returns {Array<*>} The filtered array.
 */
async function filterAsync<T> (array: T[], filter: (el: T, i: number, arr: T[]) => Promise<boolean>): Promise<T[]> {
	const bits = await Promise.all(array.map((el, i) => filter(el, i, array)));
	return array.filter(() => bits.shift());
}

export interface CommandHelp {
	desc?: string;
	args?: string;
}

export class CommandWithHelp extends Command {
	help: CommandHelp;

	constructor (names: string | string[], help: CommandHelp, process: CommandProcess, requirements?: CommandRequirements);
	constructor (names: string | string[], help: CommandHelp, process: GuildCommandProcess, requirements: CommandRequirements & { guildOnly: true; dmOnly?: false });
	constructor (names: string | string[], help: CommandHelp, process: PrivateCommandProcess, requirements: CommandRequirements & { dmOnly: true; guildOnly?: false })
	constructor (names: string | string[], help: CommandHelp, process: CommandProcess | GuildCommandProcess | PrivateCommandProcess, requirements?: CommandRequirements) {
		// Overloads for nice intellisense make things really dumb internally
		// @ts-expect-error
		super(names, process, requirements);
		this.help = help;
	}
}

const helpCommand = new Command([
	'help',
	'man',
	'h',
], async function help (msg, args, ctx) {
	let prefix = ctx.prefix;
	const client = ctx.client;
	// If the prefix is a mention of the bot, use a blank string instead so our
	// command list output is less terrible
	if (prefix.match(client.mentionPrefixRegExp!)) prefix = '';

	let message;
	// Are we provided any arguments?
	if (args.length) {
		// If the first argument also contains the prefix, remove it for lookup
		if (args[0].startsWith(prefix)) {
			args[0] = args[0].substr(prefix.length);
		}

		// Find the command we're talking about
		let command = client.commandForName(args.shift()!);
		const parentCommands: Command[] = [];

		// If we have a matching command, get help for it
		if (command) {
			// If we have more arguments, try to resolve subcommands
			// Lots of type assertions
			while (args.length) {
				const subcommand = command!.subcommandForName(args.shift()!, client.caseSensitiveCommands);
				if (!subcommand) {
					// Rather than fail entirely, if there's a subcommand that
					// doesn't exist, show help for the valid parent command
					break;
				}
				parentCommands.push(command!);
				command = subcommand;
			}

			// Generate the display string for the command based on any parents
			const commandDisplay = `${prefix}${[...parentCommands.map(c => c.names[0]), command!.names[0]].join(' ')}`;

			// Generate the help text for this command
			message = `**=== Help: \`${commandDisplay}\` ===**\n${helpText(command as CommandWithHelp, commandDisplay, prefix)}`;
		} else {
			// If this command doesn't exist, tell the user
			message = `**=== Help: Unknown Command ===**\nMake sure you spelled the command name right, and that this bot has it. Do \`${prefix}help\` with no arguments to see a list of commands.`;
		}
	} else {
		// Generate a list of commands that the user can execute
		const commandList = (await filterAsync(client.commands, c => c.checkPermissions(msg, args, ctx)))
			.map(c => `\`${prefix}${c.names[0]}\``)
			.join(', ');
		const prefixes = (await client.getPrefixesForMessage(msg))
			.filter(p => p !== prefix && client.mentionPrefixRegExp && !client.mentionPrefixRegExp.test(p))
			.map(p => `\`${p}\``);
		if (client.allowMention) {
			prefixes.push(client.user.mention);
		}
		const prefixesList = prefixes.join(', ');

		message = `**=== Help: Command List ===**
You can use the following commands: ${commandList}
Other valid prefixes are: ${prefixesList}
Use \`${prefix}help [command]\` to get more info on that command!`;
	}

	// Catch failed message sends - try to send to DMs if the channel is borked
	try {
		await msg.channel.createMessage(message);
	} catch (_) {
		try {
			const channel = await client.getDMChannel(msg.author.id);
			await channel.createMessage(`${message}\n---\n*It appears I can't send messages in the channel you sent that command in, so I've sent my response here instead. Double-check my permissions if this isn't intentional.*`);
		} catch (__) {
			// Blocked DMs or something, don't worry about it
		}
	}
});
(helpCommand as Command & {help: any}).help = {
	desc: 'Get a list of commands. Pass a command name as an argument to get information about that command.',
	args: '[command]',
};

export default helpCommand;
