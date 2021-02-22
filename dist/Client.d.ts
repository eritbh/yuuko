/** @module Yuuko */
import * as Eris from 'eris';
import { Command, CommandRequirements, CommandContext } from './Command';
import { EventListener, EventContext } from './EventListener';
import { Resolved, Resolves } from './util';
/** The options passed to the client constructor. Includes Eris options. */
export interface ClientOptions extends Eris.ClientOptions {
    /** The bot's token. */
    token: string;
    /** The prefix used to trigger commands. */
    prefix: string;
    /** If true, prefix matching is case-sensitive. */
    caseSensitivePrefix?: boolean;
    /**
     * If true, command names are case-sensitive. For example, users may use
     * !ping and !PING interchangeably (assuming ! is a valid prefix). If false,
     * command names in code must be all lowercase.
     */
    caseSensitiveCommands?: boolean;
    /** If true, the bot's mention can be used as an additional prefix. */
    allowMention?: boolean;
    /** If true, messages from other bot accounts will not trigger commands. */
    ignoreBots?: boolean;
    /**
     * If true, requirements set via setGlobalRequirements will be ignored. Used
     * for debugging, probably shouldn't be used in production.
    */
    ignoreGlobalRequirements?: boolean;
    /**
     * If true, the client does not respond to commands by default, and the user
     * must register their own `messageCreate` listener, which can call
     * `processCommand` to perform command handling at an arbitrary point during
     * the handler's execution
     */
    disableDefaultMessageListener?: boolean;
}
/** Information returned from the API about the bot's OAuth application. */
export interface ClientOAuthApplication extends Resolved<ReturnType<Client['getOAuthApplication']>> {
}
export interface PrefixFunction {
    (msg: Eris.Message, ctx: EventContext): Resolves<string | string[] | null | undefined>;
}
/** The client. */
export declare class Client extends Eris.Client implements ClientOptions {
    /** The token of the bot. */
    token: string;
    /** The prefix used to trigger commands. */
    prefix: string;
    /** If true, prefix matching is case-sensitive. */
    caseSensitivePrefix: boolean;
    /**
     * If true, command names are case-sensitive. For example, users may use
     * !ping and !PING interchangeably (assuming ! is a valid prefix). If false,
     * command names in code must be all lowercase.
     */
    caseSensitiveCommands: boolean;
    /** If true, the bot's mention can be used as an additional prefix. */
    allowMention: boolean;
    /** If true, messages from other bot accounts will not trigger commands. */
    ignoreBots: boolean;
    /**
     * If true, requirements set via setGlobalRequirements will be ignored. Used
     * for debugging, probably shouldn't be used in production.
     */
    ignoreGlobalRequirements: boolean;
    /**
     * If true, the client does not respond to commands by default, and the user
     * must register their own `messageCreate` listener, which can call
     * `processCommand` to perform command handling at an arbitrary point during
     * the handler's execution
     */
    disableDefaultMessageListener: boolean;
    /** A list of all loaded commands. */
    commands: Command[];
    /** A list of all registered event listeners. */
    events: EventListener[];
    /**
     * The default command, executed if `allowMention` is true and the bot is
     * pinged without a command
     */
    defaultCommand: Command | null;
    /** A custom function that determines the command prefix per message. */
    prefixFunction?: PrefixFunction;
    /**
     * A regular expression which matches mention prefixes. Present after the
     * first `'ready'` event is sent.
    */
    mentionPrefixRegExp: RegExp | null;
    /** Information about the bot's OAuth application. */
    app: ClientOAuthApplication | null;
    /** An object of stuff to add to the context object for command functions */
    contextAdditions: object;
    /** A requirements object that is applied to all commands */
    globalCommandRequirements: CommandRequirements;
    /** @hidden Whether or not the ready event has been emitted at least once */
    private _gotReady;
    constructor(options: ClientOptions);
    /** Returns an EventContext object with all the current context */
    get eventContext(): EventContext;
    /**
     * @override
     * @hidden
     * Hijacks the `'ready'` event so we can do custom setup.
     */
    emit(name: string, ...args: any[]): boolean;
    /** Returns the command as a list of parsed strings, or null if it's not a valid command */
    hasCommand(message: Eris.Message): Promise<[string, string, ...string[]] | null>;
    /**
     * Given a message, tries to parse a command from it. If it is a command,
     * executes it and returns `true`; otherwise, returns `false`.
     */
    processCommand(msg: any): Promise<boolean>;
    /** Adds things to the context objects the client sends. */
    extendContext(options: object): this;
    /** Set requirements for all commands at once */
    setGlobalRequirements(requirements: CommandRequirements): this;
    /** Register a command to the client. */
    addCommand(command: Command): this;
    /** Register an EventListener class instance to the client. */
    addEvent(eventListener: EventListener): this;
    /**
     * Load the files in a directory and attempt to add a command from each.
     * Searches recursively through directories, but ignores files and nested
     * directories whose names begin with a period.
     */
    addDir(dirname: string): this;
    /** Add a command or event exported from a file. */
    addFile(filename: string): this;
    /**
     * Set the default command. This command is executed when `allowMention` is
     * true and the bot is pinged with no command.
     */
    setDefaultCommand(commandName: string): this;
    /**
     * Reloads all commands and events that were loaded via from files. Useful
     * for development to hot-reload components as you work on them.
     */
    reloadFiles(): this;
    /**
     * Alias for `addDir`.
     * @deprecated
     */
    addCommandDir(dirname: string): this;
    /**
     * Alias for `addFile`.
     * @deprecated
     */
    addCommandFile(filename: string): this;
    /**
     * Alias for `reloadFiles()`.
     * @deprecated
     */
    reloadCommands(): this;
    /**
     * Checks the list of registered commands and returns one whch is known by a
     * given name.
     */
    commandForName(name: string): Command | null;
    /**
     * Registers a function used to determine what prefixes to use on a
     * per-message basis. Returns a string or an array of strings that should be
     * recognized as prefixes for the message, or `undefined` to specify that
     * the default prefix should be used. If the `allowMention` client option is
     * set, mentions will work regardless of the return value of your custom
     * function. The empty prefix also always works in private channels.
     */
    prefixes(func: PrefixFunction): this;
    getPrefixesForMessage(msg: any): Promise<string[]>;
    splitPrefixFromContent(msg: Eris.Message): Promise<[string, string] | null>;
    /** @deprecated Alias of `prefix` */
    get defaultPrefix(): string;
    set defaultPrefix(val: string);
}
export interface ClientEvents<T> extends Eris.ClientEvents<T> {
    /**
     * @event
     * Fired when a command is loaded.
     * @param command The command that was loaded
     */
    (event: 'commandLoaded', listener: (cmd: Command) => void): T;
    /**
     * @event
     * Fired just before a command has its requirements evaluated on an
     * incoming message.
     * @param command The command that will be executed
     * @param message The message that triggered the command
     * @param args The arguments passed to the command handler
     * @param context The context object for the command
     */
    (event: 'preCommand', listener: (cmd: Command, msg: Eris.Message, args: string[], ctx: CommandContext) => void): T;
    /**
     * @event
     * Fired after a command is executed.
     * @param command The command that will be executed
     * @param message The message that triggered the command
     * @param args The arguments passed to the command handler
     * @param context The context object for the command
     */
    (event: 'postCommand', listener: (cmd: Command, msg: Eris.Message, args: string[], ctx: CommandContext) => void): T;
    /**
     * @event
     * Fired if a message starts with a command but no valid command is found
     * @param command The command that will be executed
     * @param message The message that triggered the command
     * @param args The arguments passed to the command handler
     * @param context The context object for the command
     */
    (event: 'invalidCommand', listener: (msg: Eris.Message, args: string[], ctx: CommandContext) => void): T;
}
export declare interface Client extends Eris.Client {
    on: ClientEvents<this>;
}
