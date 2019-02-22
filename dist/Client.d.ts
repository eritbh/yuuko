/** @module Yuuko */
import * as Eris from 'eris';
import { Command, CommandName } from './Yuuko';
import { CommandRequirements, PartialCommandContext } from './Command';
/** Helper to get the resolved type of a Promise */
declare type Resolved<T> = T extends Promise<infer U> ? U : T;
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
    /** If true, requirements set via setGlobalRequirements will be ignored. */
    ignoreGlobalRequirements?: boolean;
}
/** Information returned from the API about the bot's OAuth application. */
export declare type ClientOAuthApplication = Resolved<ReturnType<Client["getOAuthApplication"]>>;
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
    /** If true, requirements set via setGlobalRequirements will be ignored. */
    ignoreGlobalRequirements: boolean;
    /** A list of all loaded commands. */
    commands: Command[];
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
    private _gotReady;
    constructor(options: ClientOptions);
    /** @override Hijacks the `'ready'` event so we can do custom setup. */
    emit(name: string, ...args: any[]): boolean;
    /** Given a message, see if there is a command and process it if so. */
    private handleMessage;
    /** Adds things to the context objects the client sends. */
    addContext(options: object): this;
    /** Set requirements for all commands at once */
    setGlobalRequirements(requirements: CommandRequirements): this;
    /** Register a command to the client. */
    addCommand(command: Command): this;
    /** Load the files in a directory and attempt to add a command from each. */
    addCommandDir(dirname: string): this;
    /** Add a command exported from a file. */
    addCommandFile(filename: string): this;
    /**
     * Reloads all commands that were loaded via `addCommandFile` and
     * `addCommandDir`. Useful for development to hot-reload commands as you
     * work on them.
     */
    reloadCommands(): this;
    /**
     * Checks the list of registered commands and returns one whch is known by a
     * given name, either as the command's name or an alias of the command.
     */
    commandForName(name: CommandName): Command | null;
    /**
     * Overridable method for specifying the prefix or prefixes to check a
     * message for. By default, the prefix passed in the constructor is
     * returned.
     */
    prefixes(msg: Eris.Message, ctx: PartialCommandContext): string | string[] | undefined;
    splitPrefixFromContent(msg: Eris.Message): [string, string] | null;
    /** @deprecated Alias of `prefix` */
    defaultPrefix: string;
}
export {};
