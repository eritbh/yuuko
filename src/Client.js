'use strict';

const Eris = require('eris');
const glob = require('glob');
const reload = require('require-reload')(require);
const Command = require('./Command');

/** The client. */
class Client extends Eris.Client {
	/**
	 * Create a client instance.
	 * @param {Object} options Options to start the client with. This object is
	 * also passed to Eris.
	 * @param {string} options.token The token used to log into the bot.
	 * @param {string} options.prefix A prefix for incoming messages. Only
	 * messages starting with this prefix will be treated as commands.
	 * @param {boolean} [options.caseSensitivePrefix = true] Whether the bot can
	 * treat the prefix as case-insensitive
	 * @param {boolean} [options.allowMention = true] Whether the bot can
	 * respond to messages starting with a mention of the bot instead of a
	 * prefix
	 */
	constructor (options = {}) {
		super(options.token, options);

		/** @prop {string} prefix Identical to config option */
		this.prefix = options.prefix;
		if (this.prefix === '') {
			process.emitWarning('defaultPrefix is an empty string; bot will not require a prefix to run commands');
		}

		/** @prop @deprecated Synonym for `prefix` */
		this.defaultPrefix = this.prefix;

		/** @prop {boolean} caseSensitivePrefix Identical to config option */
		this.caseSensitivePrefix = options.caseSensitivePrefix == null ? true : options.caseSensitivePrefix;

		/** @prop {boolean} allowMention Identical to config option */
		this.allowMention = options.allowMention == null ? true : options.allowMention;

		/** @prop {boolean} ignoreBots Identical to config option */
		this.ignoreBots = options.ignoreBots == null ? true : options.ignoreBots;

		/**
		 * @prop {Array<Command>} commands
		 * An array of commands the bot will respond to
		 */
		this.commands = [];

		/**
		 * @prop {RegExp|null} mentionPrefixRegExp
		 * The RegExp used to tell whether or not a message starts with a
		 * mention of the bot. Null until the 'ready' event
		 */
		this.mentionPrefixRegExp = null;

		/**
		 * @prop {Object|null} app
		 * The OAuth application information returned by Discord. Null until the
		 * 'ready' event
		 */
		this.app = null;

		// Register the message event listener
		this.on('messageCreate', this.handleMessage);
	}

	// Override Eris's emit method so we can intercept the ready event
	emit (name, ...args) {
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

	/**
	 * Given a message, see if there is a command and process it if so.
	 * @param {Eris.Message} msg The message object recieved from Eris
	 */
	async handleMessage (msg) {
		if (!msg.author) {
			return;
		}
		if (this.ignoreBots && msg.author.bot) return;

		const [prefix, content] = this.splitPrefixFromContent(msg);
		if (!content) {
			if (!prefix || !prefix.match(this.mentionPrefixRegExp)) return;
			// A lone mention triggers the default command with no arguments
			const defaultCommand = this.commandForName(null);
			if (!defaultCommand) return;
			defaultCommand.execute(this, msg, [], prefix, null);
		}
		const args = content.split(' ');
		const commandName = args.splice(0, 1)[0];
		const command = this.commandForName(commandName);
		if (!command) return;

		this.emit('preCommand', command, msg);
		await command.execute(this, msg, args, prefix, commandName);
		this.emit('command', command, msg, args);
	}

	/**
	 * Register a command to the client.
	 * @param {Command} command The command to add to the bot
	 * @returns {Client} The client object for chaining operations
	 */
	addCommand (command) {
		if (!(command instanceof Command)) throw new TypeError('Not a command');
		if (this.commandForName(command.name)) throw new Error(`Command ${command.name} already registered`);
		this.commands.push(command);
		this.emit('commandLoaded', command);
		return this;
	}

	/**
	 * Load all the JS files in a directory and attempt to load them each as
	 * commands.
	 * @param {string} dirname The absolute location of the directory
	 * @returns {Client} The client object for chaining operations
	 */
	addCommandDir (dirname) {
		if (!dirname.endsWith('/')) dirname += '/';
		const pattern = `${dirname}*.js`;
		const filenames = glob.sync(pattern);
		for (const filename of filenames) {
			this.addCommandFile(filename);
		}
		return this;
	}

	/**
	 * Load a command exported from a file.
	 * @param {string} filename The absolute location of the file
	 * @returns {Client} The client object for chaining operations
	 */
	addCommandFile (filename) {
		const command = reload(filename);
		command.filename = filename;
		this.addCommand(command);
		return this;
	}

	/**
	 * Reloads all commands that were loaded via `addCommandFile` and
	 * `addCommandDir`. Useful for development to hot-reload commands as you
	 * work on them.
	 * @returns {Client} The client object for chaining operations
	 */
	reloadCommands () {
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
	 * @param {string} name The name of the command to look for
	 * @returns {Command|null} The correct command, or `null` if there is none
	 */
	commandForName (name) {
		return this.commands.find(c => c.names.includes(name));
	}

	/**
	 * Returns the appropriate prefix string to use for commands based on a
	 * certain message.
	 * @deprecated
	 * @param {Object} _msg The message to check the prefix of
	 * @returns {string} The prefix to use
	 */
	prefixForMessage (_msg) {
		return this.prefix;
	}

	/**
	 * Takes a message and checks whether or not it starts with the set prefix,
	 * taling into account the case-sensitivity option.
	 * @param {Eris.Message} msg The message to process
	 * @returns {boolean} Whether or not the message matches the prefix
	 */
	matchesTextPrefix (msg) {
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
	splitPrefixFromContent (msg) {
		// Traditional prefix handling - if there is no prefix, skip this rule
		if (this.matchesTextPrefix(msg)) {
			return [this.prefix, msg.content.substr(this.prefix.length)];
		}
		// Allow mentions to be used as prefixes according to config
		const match = msg.content.match(this.mentionPrefixRegExp);
		if (this.allowMention && match) { // TODO: guild config
			return [match[0], msg.content.substr(match[0].length)];
		}
		// Allow no prefix in direct message channels
		if (!msg.channel.guild) {
			return ['', msg.content];
		}
		// we got nothing
		return [null, null];
	}
}

module.exports = Client;
