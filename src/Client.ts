import * as Eris from 'eris';
import * as glob from 'glob';
import {oneLine} from 'common-tags';
import {Command, CommandName} from './Yuuko'

/** Helper to get the resolved type of a Promise */
type Resolved<T> = T extends Promise<infer U> ? U : T;

/** The options passed to the client constructor. Includes Eris options. */
export interface ClientOptions extends Eris.ClientOptions {
	/** The bot's token. */
	token: string,
	/** The prefix used to trigger commands. */
	prefix: string,
	/** If true, prefix matching is case-sensitive. */
	caseSensitivePrefix?: boolean,
	/** If true, the bot's mention can be used as an additional prefix. */
	allowMention?: boolean,
	/** If true, messages from other bot accounts will not trigger commands. */
	ignoreBots?: boolean,
}

/** Information returned from the API about the bot's OAuth application. */
// TODO: obviated by https://github.com/abalabahaha/eris/pull/467
export type ClientOAuthApplication =
	Resolved<ReturnType<Client["getOAuthApplication"]>>

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
	/** A list of all loaded commands. */
	commands: Command[] = [];
	/**
	 * A regular expression which matches mention prefixes. Present after the
	 * first `'ready'` event is sent.
	*/
	mentionPrefixRegExp: RegExp | null = null;
	/** Information about the bot's OAuth application. */
	app: ClientOAuthApplication | null = null;

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


		// Warn if we're using an empty prefix
		if (options.prefix === '') {
			process.emitWarning(oneLine`
				defaultPrefix is an empty string; bot will not require a prefix
				to run commands
			`);
		}

		// Register the message event listener
		this.on('messageCreate', this.handleMessage);
	}

	/** @override Hijacks the `'ready'` event so we can do custom setup. */
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

		const matchResult = this.splitPrefixFromContent(msg);
		if (!matchResult) return;
		const [prefix, content] = matchResult;
		// If there is no content past the prefix, we don't have a command
		if (!content) {
			// If we don't have the bot's prefix either, do nothing
			if (!prefix || !prefix.match(this.mentionPrefixRegExp!)) return;
			// A lone mention triggers the default command with no arguments
			const defaultCommand = this.commandForName(null);
			if (!defaultCommand) return;
			defaultCommand.execute(msg, [], {
				client: this,
				prefix,
				commandName: null,
			});
			return;
		}
		const args = content.split(' ');
		const commandName = args.shift();
		if (commandName === undefined) return;
		const command = this.commandForName(commandName);
		if (!command) return;

		const ctx = {
			client: this,
			prefix,
			commandName,
		};
		this.emit('preCommand', command, msg, args, ctx);
		await command.execute(msg, args, ctx);
		this.emit('command', command, msg, args, ctx);
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
		// js files are expected to use module.exports = new Command(...);
		// ts files are expected to use export default new Command(...);
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
		// Iterates over the list backwards to avoid overwriting indexes
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

	/** @deprecated Always returns the prefix specified in config. */
	prefixForMessage (_msg: Eris.Message): string {
		return this.prefix;
	}

	/**
	 * Takes a message and checks whether or not it starts with the set prefix,
	 * taking into account the case-sensitivity option.
	 */
	matchesTextPrefix (msg: Eris.Message): boolean {
		const prefix = this.prefixForMessage(msg);
		if (prefix == null) return false;
		if (this.caseSensitivePrefix) {
			return msg.content.startsWith(prefix);
		}
		return msg.content.toLowerCase().startsWith(prefix.toLowerCase());
	}

	// Takes a message, gets the prefix based on the config of any guild it was
	// sent in, and returns the message's content without the prefix if the
	// prefix matches, and `null` if it doesn't.
	// @param {Eris.Message} msg The message to process
	// @returns {Array<String|null>} An array `[prefix, rest]` if the message
	// matches the prefix, or `[null, null]` if not
	splitPrefixFromContent (msg: Eris.Message): [string, string] | null {
		// Traditional prefix handling - if there is no prefix, skip this rule
		if (this.matchesTextPrefix(msg)) {
			return [this.prefix, msg.content.substr(this.prefix.length)];
		}
		// Allow mentions to be used as prefixes according to config
		const match = msg.content.match(this.mentionPrefixRegExp!);
		if (this.allowMention && match) { // TODO: guild config
			return [match[0], msg.content.substr(match[0].length)];
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
	set defaultPrefix(val: string) {
		this.prefix = val;
	}
}
