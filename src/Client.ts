/** @module Yuuko */

import * as Eris from 'eris';
import * as glob from 'glob';
import {Command, CommandName} from './Yuuko';
// TODO: PartialCommandContext is only used in this file, should be defined here
import {CommandRequirements, PartialCommandContext, CommandContext} from './Command';
import {Resolved, Resolves, makeArray} from './util';

/** The options passed to the client constructor. Includes Eris options. */
export interface ClientOptions extends Eris.ClientOptions {
	/** The bot's token. */
	token: string;
	/** The prefix used to trigger commands. */
	prefix: string;
	/** If true, prefix matching is case-sensitive. */
	caseSensitivePrefix?: boolean;
	/** If true, the bot's mention can be used as an additional prefix. */
	allowMention?: boolean;
	/** If true, messages from other bot accounts will not trigger commands. */
	ignoreBots?: boolean;
	/**
	 * If true, requirements set via setGlobalRequirements will be ignored. Used
	 * for debugging, probably shouldn't be used in production.
	*/
	ignoreGlobalRequirements?: boolean;
}

/** Information returned from the API about the bot's OAuth application. */
// TODO: obviated by https://github.com/abalabahaha/eris/pull/467
export type ClientOAuthApplication =
	Resolved<ReturnType<Client['getOAuthApplication']>>;

export type PrefixFunction =
	(msg: Eris.Message, ctx: PartialCommandContext) => Resolves<string | string[] | null | undefined>;

/** The client. */
export class Client extends Eris.Client implements ClientOptions {
	/** The token of the bot. */
	token: string;

	/** The prefix used to trigger commands. */
	prefix: string;

	/** If true, prefix matching is case-sensitive. */
	caseSensitivePrefix: boolean = true;

	/** If true, the bot's mention can be used as an additional prefix. */
	allowMention: boolean = true;

	/** If true, messages from other bot accounts will not trigger commands. */
	ignoreBots: boolean = true;

	/**
	 * If true, requirements set via setGlobalRequirements will be ignored. Used
	 * for debugging, probably shouldn't be used in production.
	 */
	ignoreGlobalRequirements: boolean = false;

	/** A list of all loaded commands. */
	commands: Command[] = [];

	/** A custom function that determines the command prefix per message. */
	prefixFunction?: PrefixFunction;

	/**
	 * A regular expression which matches mention prefixes. Present after the
	 * first `'ready'` event is sent.
	*/
	mentionPrefixRegExp: RegExp | null = null;

	/** Information about the bot's OAuth application. */
	app: ClientOAuthApplication | null = null;

	/** An object of stuff to add to the context object for command functions */
	contextAdditions: object = {};

	/** A requirements object that is applied to all commands */
	globalCommandRequirements: CommandRequirements = {};

	private _gotReady: boolean = false;

	constructor (options: ClientOptions) {
		super(options.token, options); // Do Eris client constructor stuff
		// HACK: Technically this is already set by the super constructor, but
		//       Eris defines token as an optional property even though it's not
		this.token = options.token;

		// Apply options on top of defaults
		// Object.assign(this, options); // eventually maybe we can just do this
		this.prefix = options.prefix;
		if (options.caseSensitivePrefix !== undefined) this.caseSensitivePrefix = options.caseSensitivePrefix;
		if (options.allowMention !== undefined) this.allowMention = options.allowMention;
		if (options.ignoreBots !== undefined) this.ignoreBots = options.ignoreBots;
		if (options.ignoreGlobalRequirements !== undefined) this.ignoreGlobalRequirements = options.ignoreGlobalRequirements;

		// Warn if we're using an empty prefix
		if (this.prefix === '') {
			process.emitWarning('prefx is an empty string; bot will not require a prefix to run commands');
		}

		// Register the message event listener
		this.on('messageCreate', this.handleMessage);
	}

	/**
	 * @override
	 * @hidden
	 * Hijacks the `'ready'` event so we can do custom setup.
	 */
	emit (name: string, ...args: any[]): boolean {
		// We only want to customize the 'ready' event the first time
		if (name !== 'ready' || this._gotReady) return super.emit(name, ...args);
		this._gotReady = true;
		this.mentionPrefixRegExp = new RegExp(`^<@!?${this.user.id}>\\s?`);
		this.getOAuthApplication().then(app => {
			this.app = app;
			/**
			 * @event Client#ready
			 * Overridden from the Eris ready event. Functionally the same, but
			 * only emitted after internal setup of the app and
			 * prefixMentionRegExp properties.
			 */
			super.emit('ready', ...args);
		});
		return !!this.listeners(name).length;
	}

	/** Given a message, see if there is a command and process it if so. */
	private async handleMessage (msg: Eris.Message): Promise<void> {
		if (!msg.author) return; // this is a bug and shouldn't really happen
		if (this.ignoreBots && msg.author.bot) return;

		// Construct a partial context (without prefix or command name)
		const partialContext: PartialCommandContext = Object.assign({
			client: this,
		}, this.contextAdditions);
		// Is the message properly prefixed? If not, we can ignore it
		const matchResult = await this.splitPrefixFromContent(msg, partialContext);
		if (!matchResult) return;
		// It is! We can
		const [prefix, content] = matchResult;
		// If there is no content past the prefix, we don't have a command
		if (!content) {
			// But a lone mention will trigger the default command instead
			if (!prefix || !prefix.match(this.mentionPrefixRegExp!)) return;
			const defaultCommand = this.commandForName(null);
			if (!defaultCommand) return;
			defaultCommand.execute(msg, [], Object.assign({
				client: this,
				prefix,
				commandName: null,
			}, this.contextAdditions));
			return;
		}
		// Separate command name from arguments and find command object
		const args = content.split(' ');
		const commandName = args.shift();
		if (commandName === undefined) return;
		const command = this.commandForName(commandName);
		// Construct a full context object now that we have all the info
		const fullContext: CommandContext = Object.assign({
			prefix,
			commandName,
		}, partialContext);
		// If the message has command but that command is not found
		if (!command) {
			this.emit('invalidCommand', msg, args, fullContext);
			return;
		}
		// Do the things
		this.emit('preCommand', command, msg, args, fullContext);
		const executed = await command.execute(msg, args, fullContext);
		if (executed) {
			this.emit('command', command, msg, args, fullContext);
		}
	}

	/** Adds things to the context objects the client sends. */
	extendContext (options: object): this {
		Object.assign(this.contextAdditions, options);
		return this;
	}

	/** Set requirements for all commands at once */
	setGlobalRequirements (requirements: CommandRequirements) {
		Object.assign(this.globalCommandRequirements, requirements);
		return this;
	}

	/** Register a command to the client. */
	addCommand (command: Command): this {
		if (!(command instanceof Command)) throw new TypeError('Not a command');
		if (this.commandForName(command.name)) throw new Error(`Command ${command.name} already registered`);
		this.commands.push(command);
		this.emit('commandLoaded', command);
		return this;
	}

	/** Load the files in a directory and attempt to add a command from each. */
	addCommandDir (dirname: string): this {
		if (!dirname.endsWith('/')) dirname += '/';
		const pattern = `${dirname}*.[tj]s`;
		const filenames = glob.sync(pattern);
		for (const filename of filenames) {
			this.addCommandFile(filename);
		}
		return this;
	}

	/** Add a command exported from a file. */
	// TODO: support exporting multiple commands?
	addCommandFile (filename: string): this {
		delete require.cache[filename];
		// JS files are expected to use `module.exports = new Command(...);`
		// TS files are expected to use `export default new Command(...);`
		// eslint-disable-next-line global-require
		let command = require(filename);
		if (command.default instanceof Command) {
			// Use object.assign to preserve other exports
			// TODO: this kinda breaks typescript but it's fine
			command = Object.assign(command.default, command);
			delete command.default;
		} else if (!(command instanceof Command)) {
			throw new TypeError(`File ${filename} does not export a command`);
		}
		command.filename = filename;
		this.addCommand(command);
		return this;
	}

	/**
	 * Reloads all commands that were loaded via `addCommandFile` and
	 * `addCommandDir`. Useful for development to hot-reload commands as you
	 * work on them.
	 */
	reloadCommands (): this {
		// Iterates over the list backwards to avoid overwriting indexes (this
		// rewrites the list in reverse order, but we don't care)
		let i = this.commands.length;
		while (i--) {
			const command = this.commands[i];
			if (command.filename) {
				this.commands.splice(i, 1);
				this.addCommandFile(command.filename);
			}
		}
		return this;
	}

	/**
	 * Checks the list of registered commands and returns one whch is known by a
	 * given name, either as the command's name or an alias of the command.
	 */
	commandForName (name: CommandName): Command | null {
		return this.commands.find(c => c.names.includes(name)) || null;
	}

	/**
	 * Registers a function used to determine what prefixes to use on a
	 * per-message basis. Returns a string or an array of strings that should be
	 * recognized as prefixes for the message, or `undefined` to specify that
	 * the default prefix should be used. If the `allowMention` client option is
	 * set, mentions will work regardless of the return value of your custom
	 * function. The empty prefix also always works in private channels.
	 */
	prefixes (func: PrefixFunction): this {
		if (this.prefixFunction) {
			process.emitWarning('Client.prefixes called multiple times');
		}
		this.prefixFunction = func;
		return this;
	}

	async getPrefixesForMessage (msg, ctx) {
		const prefixes = this.prefixFunction && await this.prefixFunction(msg, ctx);
		if (prefixes == null) {
			// If we have no custom function or it returned nothing, use default
			return [this.prefix];
		}
		// Always return as an array, even if we got a single result back
		return makeArray(prefixes);
	}

	// Takes a message, gets the prefix based on the config of any guild it was
	// sent in, and returns the message's content without the prefix if the
	// prefix matches, and `null` if it doesn't.
	// @param {Eris.Message} msg The message to process
	// @returns {Array<String|null>} An array `[prefix, rest]` if the message
	// matches the prefix, or `[null, null]` if not
	async splitPrefixFromContent (msg: Eris.Message, ctx: PartialCommandContext): Promise<[string, string] | null> {
		const prefixes = await this.getPrefixesForMessage(msg, ctx);

		// Traditional prefix checking
		for (const prefix of prefixes) {
			if (this.caseSensitivePrefix ? msg.content.startsWith(prefix) : msg.content.toLowerCase().startsWith(prefix.toLowerCase())) {
				return [prefix, msg.content.substr(prefix.length)];
			}
		}
		// Allow mentions to be used as prefixes according to config
		if (this.allowMention) {
			const match = msg.content.match(this.mentionPrefixRegExp!);
			if (match) { // TODO: guild config
				return [match[0], msg.content.substr(match[0].length)];
			}
		}
		// Allow no prefix in direct message channels
		if (!(msg.channel instanceof Eris.GuildChannel)) {
			return ['', msg.content];
		}
		// we got nothing
		return null;
	}

	/** @deprecated Alias of `prefix` */
	get defaultPrefix () {
		return this.prefix;
	}

	set defaultPrefix (val: string) {
		this.prefix = val;
	}
}

export declare interface Client extends Eris.Client {
	on(event: string, listener: Function): this;
	/**
	 * @event
	 * Fired when a command is loaded.
	 * @param command The command that was loaded
	 */
	on(event: 'commandLoaded', listener: (cmd: Command) => void): this;
	/**
	 * @event
	 * Fired just before a command has its requirements evaluated on an
	 * incoming message.
	 * @param command The command that will be executed
	 * @param message The message that triggered the command
	 * @param args The arguments passed to the command handler
	 * @param context The context object for the command
	 */
	on(event: 'preCommand', listener: (cmd: Command, msg: Eris.Message, args: string[], ctx: CommandContext) => void): this;
	/**
	 * @event
	 * Fired after a command is executed.
	 * @param command The command that will be executed
	 * @param message The message that triggered the command
	 * @param args The arguments passed to the command handler
	 * @param context The context object for the command
	 */
	on(event: 'preCommand', listener: (cmd: Command, msg: Eris.Message, args: string[], ctx: CommandContext) => void): this;
}

// Added event definitions
// export declare interface Client extends Eris.Client {
// 	on(event: string, listener: Function): this;
// 	on(event: 'preCommand' | 'command', listener: (
// 		command: Command,
// 		msg: Eris.Message,
// 		args: string[],
// 		ctx: CommandContext,
// 	) => void): this;
// 	on(event: 'commandLoaded', listener: (command: Command) => void): this;
// }
