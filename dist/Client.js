"use strict";
/** @module Yuuko */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const Eris = __importStar(require("eris"));
const Command_1 = require("./Command");
const EventListener_1 = require("./EventListener");
const defaultMessageListener_1 = __importDefault(require("./defaultMessageListener"));
const util_1 = require("./util");
/** The client. */
class Client extends Eris.Client {
    constructor(options) {
        super(options.token, options); // Do Eris client constructor stuff
        /** If true, prefix matching is case-sensitive. */
        this.caseSensitivePrefix = true;
        /**
         * If true, command names are case-sensitive. For example, users may use
         * !ping and !PING interchangeably (assuming ! is a valid prefix). If false,
         * command names in code must be all lowercase.
         */
        this.caseSensitiveCommands = false;
        /** If true, the bot's mention can be used as an additional prefix. */
        this.allowMention = true;
        /** If true, messages from other bot accounts will not trigger commands. */
        this.ignoreBots = true;
        /** A set of requirements to check for all commands. */
        this.globalCommandRequirements = {};
        /**
         * If true, requirements set via `setGlobalRequirements` will be ignored. Used
         * for debugging, probably shouldn't be used in production.
         * @deprecated Pass no `globalCommandRequirements` client option instead.
         */
        this.ignoreGlobalRequirements = false;
        /**
         * If true, the client does not respond to commands by default, and the user
         * must register their own `messageCreate` listener, which can call
         * `processCommand` to perform command handling at an arbitrary point during
         * the handler's execution
         */
        this.disableDefaultMessageListener = false;
        /** A list of all loaded commands. */
        this.commands = [];
        /** A list of all registered event listeners. */
        this.events = [];
        /**
         * The default command, executed if `allowMention` is true and the bot is
         * pinged without a command
         */
        this.defaultCommand = null;
        /**
         * A regular expression which matches mention prefixes. Present after the
         * first `'ready'` event is sent.
        */
        this.mentionPrefixRegExp = null;
        /** Information about the bot's OAuth application. */
        this.app = null;
        /** An object of stuff to add to the context object for command functions */
        this.contextAdditions = {};
        /** @hidden Whether or not the ready event has been emitted at least once */
        this._gotReady = false;
        // HACK: Technically this is already set by the super constructor, but
        //       Eris defines token as an optional property even though it's not
        this.token = options.token;
        // Apply options on top of defaults
        // Object.assign(this, options); // eventually maybe we can just do this
        this.prefix = options.prefix;
        if (options.caseSensitivePrefix !== undefined)
            this.caseSensitivePrefix = options.caseSensitivePrefix;
        if (options.caseSensitiveCommands !== undefined)
            this.caseSensitiveCommands = options.caseSensitiveCommands;
        if (options.allowMention !== undefined)
            this.allowMention = options.allowMention;
        if (options.ignoreBots !== undefined)
            this.ignoreBots = options.ignoreBots;
        if (options.globalCommandRequirements !== undefined)
            this.globalCommandRequirements = options.globalCommandRequirements;
        if (options.ignoreGlobalRequirements !== undefined)
            this.ignoreGlobalRequirements = options.ignoreGlobalRequirements;
        if (options.disableDefaultMessageListener !== undefined)
            this.disableDefaultMessageListener = options.disableDefaultMessageListener;
        // Warn if we're using an empty prefix
        if (this.prefix === '') {
            process.emitWarning('prefx is an empty string; bot will not require a prefix to run commands');
        }
        // Register the default message listener unless it's disabled
        if (!this.disableDefaultMessageListener) {
            this.addEvent(defaultMessageListener_1.default);
        }
    }
    /** Returns an EventContext object with all the current context */
    get eventContext() {
        return Object.assign({ client: this }, this.contextAdditions);
    }
    /**
     * @override
     * @hidden
     * Hijacks the `'ready'` event so we can do custom setup.
     */
    emit(name, ...args) {
        // We only want to customize the 'ready' event the first time
        if (name !== 'ready' || this._gotReady)
            return super.emit(name, ...args);
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
    /** Returns the command as a list of parsed strings, or null if it's not a valid command */
    hasCommand(message) {
        return __awaiter(this, void 0, void 0, function* () {
            // Is the message properly prefixed? If not, we can ignore it
            const matchResult = yield this.splitPrefixFromContent(message);
            if (!matchResult)
                return null;
            // It is! We can
            const [prefix, content] = matchResult;
            // If there is no content past the prefix, we don't have a command
            if (!content) {
                // But a lone mention will trigger the default command instead
                if (!prefix || !prefix.match(this.mentionPrefixRegExp))
                    return null;
                return [prefix, ''];
            }
            const args = content.split(' ');
            let commandName = args.shift();
            if (commandName === undefined)
                return null;
            if (!this.caseSensitiveCommands)
                commandName = commandName.toLowerCase();
            return [prefix, commandName, ...args];
        });
    }
    /**
     * Given a message, tries to parse a command from it. If it is a command,
     * executes it and returns `true`; otherwise, returns `false`.
     */
    processCommand(msg) {
        return __awaiter(this, void 0, void 0, function* () {
            const commandInfo = yield this.hasCommand(msg);
            if (!commandInfo)
                return false;
            const [prefix, commandName, ...args] = commandInfo;
            const command = this.commandForName(commandName);
            // Construct a full context object now that we have all the info
            const fullContext = Object.assign({
                prefix,
                commandName,
            }, this.eventContext);
            // If the message has command but that command is not found
            if (!command) {
                this.emit('invalidCommand', msg, args, fullContext);
                return false;
            }
            // Do the things
            this.emit('preCommand', command, msg, args, fullContext);
            const executed = yield command.execute(msg, args, fullContext);
            if (executed)
                this.emit('postCommand', command, msg, args, fullContext);
            return true;
        });
    }
    /** Adds things to the context objects the client sends. */
    extendContext(options) {
        Object.assign(this.contextAdditions, options);
        return this;
    }
    /**
     * Set requirements for all commands at once
     * @deprecated Use the `globalCommandRequirements` client option instead.
     */
    setGlobalRequirements(requirements) {
        Object.assign(this.globalCommandRequirements, requirements);
        return this;
    }
    /** Register a command to the client. */
    addCommand(command) {
        if (!(command instanceof Command_1.Command))
            throw new TypeError('Not a command');
        for (const name of command.names) {
            for (const otherCommand of this.commands) {
                if (otherCommand.names.includes(name)) {
                    throw new TypeError(`Two commands have the same name: ${name}`);
                }
            }
        }
        this.commands.push(command);
        this.emit('commandLoaded', command);
        return this;
    }
    /** Register an EventListener class instance to the client. */
    addEvent(eventListener) {
        this.events.push(eventListener);
        // The actual function registered as a listener calls the instance's
        // registered function with the context object as the last parameter. We
        // store it as a property of the listener so it can be removed later (if
        // the instance was registered via `addDir`/`addFile`, then it will need
        // to be removed when calling `reloadFiles`).
        eventListener.computedListener = (...args) => {
            eventListener.args[1](...args, this.eventContext);
        };
        if (eventListener.once) {
            this.once(eventListener.args[0], eventListener.computedListener);
        }
        else {
            this.on(eventListener.args[0], eventListener.computedListener);
        }
        return this;
    }
    /**
     * Load the files in a directory and attempt to add a command from each.
     * Searches recursively through directories, but ignores files and nested
     * directories whose names begin with a period.
     */
    addDir(dirname) {
        // Synchronous calls are fine with this method because it's only called
        // on init
        // eslint-disable-next-line no-sync
        const filenames = fs_1.default.readdirSync(dirname);
        for (const filename of filenames) {
            // ignore files/directories that are disabled with a leading dot
            if (filename.startsWith('.')) {
                continue;
            }
            const filepath = path_1.default.resolve(dirname, filename);
            // eslint-disable-next-line no-sync
            const info = fs_1.default.statSync(filepath);
            if (info && info.isDirectory()) {
                this.addDir(filepath);
            }
            else {
                // Add files only if they can be required
                for (const extension of Object.keys(require.extensions)) {
                    if (filepath.endsWith(extension)) {
                        this.addFile(filepath);
                    }
                }
            }
        }
        return this;
    }
    /** Add a command or event exported from a file. */
    // TODO: support exporting multiple components?
    addFile(filename) {
        // Clear require cache so we always get a fresh copy
        delete require.cache[filename];
        // eslint-disable-next-line global-require
        let things = require(filename);
        // Resolve es6 module default exports
        if (things.default) {
            things = Object.assign(things.default, things);
            delete things.default;
        }
        // Handle single exports as arrays
        if (!Array.isArray(things)) {
            // If a single object was exported
            things = [things];
        }
        // register all exported objects
        for (let thing of things) {
            // Resolve es6 module exports *again* since we might have an array
            // of individual es6 modules sometimes
            if (thing.default) {
                thing = Object.assign(thing.default, thing);
                delete thing.default;
            }
            thing.filename = filename;
            try {
                if (thing instanceof Command_1.Command) {
                    this.addCommand(thing);
                }
                else if (thing instanceof EventListener_1.EventListener) {
                    this.addEvent(thing);
                }
                else {
                    throw new TypeError('Imported value is not a command or event listener');
                }
            }
            catch (error) {
                // Add filename to errors and re-throw
                error.filename = filename;
                throw error;
            }
        }
        return this;
    }
    /**
     * Set the default command. This command is executed when `allowMention` is
     * true and the bot is pinged with no command.
     */
    setDefaultCommand(commandName) {
        const command = this.commandForName(commandName);
        if (!command)
            throw new TypeError(`No known command matches ${commandName}`);
        this.defaultCommand = command;
        return this;
    }
    /**
     * Reloads all commands and events that were loaded via from files. Useful
     * for development to hot-reload components as you work on them.
     */
    reloadFiles() {
        const filenames = [];
        for (const list of [this.commands, this.events]) {
            // Iterate over each list backwards to avoid overwriting indexes
            let i = list.length;
            while (i--) {
                const thing = list[i];
                if (thing.filename) {
                    // Remove the thing from the list
                    list.splice(i, 1);
                    // Record the file it came from so we can reload it
                    filenames.push(thing.filename);
                    // If it's an event listener object, remove the listener
                    if (thing instanceof EventListener_1.EventListener && thing.computedListener) {
                        this.removeListener(thing.args[0], thing.computedListener);
                    }
                }
            }
        }
        // Reload each unique filename
        for (const filename of filenames.filter((f, i, a) => a.indexOf(f) === i)) {
            this.addFile(filename);
        }
        return this;
    }
    /**
     * Alias for `addDir`.
     * @deprecated
     */
    addCommandDir(dirname) {
        return this.addDir(dirname);
    }
    /**
     * Alias for `addFile`.
     * @deprecated
     */
    addCommandFile(filename) {
        return this.addFile(filename);
    }
    /**
     * Alias for `reloadFiles()`.
     * @deprecated
     */
    reloadCommands() {
        return this.reloadFiles();
    }
    /**
     * Checks the list of registered commands and returns one whch is known by a
     * given name. Passing an empty string will return the default command, if
     * any.
     */
    commandForName(name) {
        if (name === '')
            return this.defaultCommand;
        if (this.caseSensitiveCommands)
            return this.commands.find(c => c.names.includes(name)) || null;
        return this.commands.find(c => c.names.some(n => n.toLowerCase() === name.toLowerCase())) || null;
    }
    /**
     * Registers a function used to determine what prefixes to use on a
     * per-message basis. Returns a string or an array of strings that should be
     * recognized as prefixes for the message, or `undefined` to specify that
     * the default prefix should be used. If the `allowMention` client option is
     * set, mentions will work regardless of the return value of your custom
     * function. The empty prefix also always works in private channels.
     */
    prefixes(func) {
        if (this.prefixFunction) {
            process.emitWarning('Client.prefixes called multiple times');
        }
        this.prefixFunction = func;
        return this;
    }
    getPrefixesForMessage(msg) {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO inlining this context creation is bleh
            const prefixes = this.prefixFunction && (yield this.prefixFunction(msg, this.eventContext));
            if (prefixes == null) {
                // If we have no custom function or it returned nothing, use default
                return [this.prefix];
            }
            // Always return as an array, even if we got a single result back
            return util_1.makeArray(prefixes);
        });
    }
    // Takes a message, gets the prefix based on the config of any guild it was
    // sent in, and returns the message's content without the prefix if the
    // prefix matches, and `null` if it doesn't.
    // @param {Eris.Message} msg The message to process
    // @returns {Array<String|null>} An array `[prefix, rest]` if the message
    // matches the prefix, or `[null, null]` if not
    splitPrefixFromContent(msg) {
        return __awaiter(this, void 0, void 0, function* () {
            const prefixes = yield this.getPrefixesForMessage(msg);
            // Traditional prefix checking
            for (const prefix of prefixes) {
                if (this.caseSensitivePrefix ? msg.content.startsWith(prefix) : msg.content.toLowerCase().startsWith(prefix.toLowerCase())) {
                    return [prefix, msg.content.substr(prefix.length)];
                }
            }
            // Allow mentions to be used as prefixes according to config
            if (this.allowMention) {
                const match = msg.content.match(this.mentionPrefixRegExp);
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
        });
    }
    /** @deprecated Alias of `prefix` */
    get defaultPrefix() {
        return this.prefix;
    }
    set defaultPrefix(val) {
        this.prefix = val;
    }
}
exports.Client = Client;
