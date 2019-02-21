import * as Eris from 'eris';
import { Command, CommandName } from './Yuuko';
import { CommandContext } from './Command';
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
    private _gotReady;
    constructor(options: ClientOptions);
    /** @override Hijacks the `'ready'` event so we can do custom setup. */
    emit(name: string, ...args: any[]): boolean;
    /** Given a message, see if there is a command and process it if so. */
    private handleMessage;
    /** Adds things to the context objects the client sends. */
    addContext(options: object): this;
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
    /** Specifies the prefix to look for when trying to match a message. */
    prefixForMessage(_msg: Eris.Message, ctx: object): string;
    /**
     * Takes a message and checks whether or not it starts with the set prefix,
     * taking into account the case-sensitivity option.
     */
    matchesTextPrefix(msg: Eris.Message): boolean;
    splitPrefixFromContent(msg: Eris.Message): [string, string] | null;
    /** @deprecated Alias of `prefix` */
    defaultPrefix: string;
}
export declare interface Client extends Eris.Client {
    on(event: string, listener: Function): this;
    on(event: 'preCommand' | 'command', listener: (command: Command, msg: Eris.Message, args: string[], ctx: CommandContext) => void): this;
    on(event: 'commandLoaded', listener: (command: Command) => void): this;
}
export {};
