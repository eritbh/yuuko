/** @module Yuuko */
import * as Eris from 'eris';
import { Command } from './Yuuko';
import { CommandRequirements, PartialCommandContext, CommandContext } from './Command';
import { Resolved, Resolves } from './util';
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
export interface ClientOAuthApplication extends Resolved<ReturnType<Client['getOAuthApplication']>> {
}
export interface PrefixFunction {
    (msg: Eris.Message, ctx: PartialCommandContext): Resolves<string | string[] | null | undefined>;
}
/** The client. */
export declare class Client extends Eris.Client implements ClientOptions {
    /** The token of the bot. */
    token: string;
    /** The prefix used to trigger commands. */
    prefix: string;
    /** If true, prefix matching is case-sensitive. */
    caseSensitivePrefix: boolean;
    /** If true, the bot's mention can be used as an additional prefix. */
    allowMention: boolean;
    /** If true, messages from other bot accounts will not trigger commands. */
    ignoreBots: boolean;
    /**
     * If true, requirements set via setGlobalRequirements will be ignored. Used
     * for debugging, probably shouldn't be used in production.
     */
    ignoreGlobalRequirements: boolean;
    /** A list of all loaded commands. */
    commands: Command[];
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
    /**
     * @override
     * @hidden
     * Hijacks the `'ready'` event so we can do custom setup.
     */
    emit(name: string, ...args: any[]): boolean;
    /** Given a message, see if there is a command and process it if so. */
    private handleMessage;
    /** Adds things to the context objects the client sends. */
    extendContext(options: object): this;
    /** Set requirements for all commands at once */
    setGlobalRequirements(requirements: CommandRequirements): this;
    /** Register a command to the client. */
    addCommand(command: Command): this;
    /** Load the files in a directory and attempt to add a command from each. */
    addCommandDir(dirname: string): this;
    /** Add a command exported from a file. */
    addCommandFile(filename: string): this;
    /**
     * Set the default command. This command is executed when `allowMention` is
     * true and the bot is pinged with no command.
     */
    setDefaultCommand(commandName: string): this;
    /**
     * Reloads all commands that were loaded via `addCommandFile` and
     * `addCommandDir`. Useful for development to hot-reload commands as you
     * work on them.
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
    getPrefixesForMessage(msg: any, ctx: any): Promise<string[]>;
    splitPrefixFromContent(msg: Eris.Message, ctx: PartialCommandContext): Promise<[string, string] | null>;
    /** @deprecated Alias of `prefix` */
    get defaultPrefix(): string;
    set defaultPrefix(val: string);
}
interface YuukoEvents<T> extends Eris.ClientEvents<T> {
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
    on: YuukoEvents<this>;
}
export {};
