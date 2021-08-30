/** @module Yuuko */
import * as Eris from 'eris';
import { EventContext } from './Yuuko';
/** An object of requirements a user must meet to use the command. */
export interface CommandRequirements {
    /** If true, the user must be the bot's owner. */
    owner?: boolean;
    /** If true, the message must be sent in a server channel. */
    guildOnly?: boolean;
    /** If true, the message must be sent in a DM channel. */
    dmOnly?: boolean;
    /**
     * A list of permission strings the user must have. If set, the `guildOnly`
     * option is implied.
     */
    permissions?: (keyof Eris.Constants['Permissions'])[];
    /** A custom function that must return true to enable the command. */
    custom?(msg: Eris.Message, args: string[], ctx: CommandContext): boolean | Promise<boolean>;
}
/** An object containing context information for a command's execution. */
export interface CommandContext extends EventContext {
    /** The prefix used to call the command. */
    prefix: string;
    /** The name or alias used to call the command. */
    commandName?: string;
}
/** The function to be called when a command is executed. */
export interface CommandProcess<T extends Eris.Textable = Eris.TextableChannel> {
    (
    /** The message object from Eris. */
    msg: Eris.Message<T>, 
    /** A space-separated list of arguments to the command. */
    args: string[], 
    /** An object containing additional context information. */
    ctx: CommandContext): void;
}
export declare type GuildCommandProcess = CommandProcess<Eris.GuildTextableChannel>;
export declare type PrivateCommandProcess = CommandProcess<Eris.PrivateChannel>;
/** Class representing a command. */
export declare class Command {
    /**
     * A list of the command's names. The first should be considered the
     * command's canonical or display name. All characters must be lowercase if
     * the client option `caseSensitiveCommands` is false or unset.
     */
    names: string[];
    /** The function executed when the command is triggered. */
    process: CommandProcess;
    /** The requirements for the command being triggered. */
    requirements: CommandRequirements;
    /** The name of the file the command was loaded from, if any. */
    filename?: string;
    /** Subcommands of this command. */
    subcommands: Command[];
    /** Creates a command. */
    constructor(names: string | string[], process: CommandProcess);
    /** Creates a command restricted to use in guilds. */
    constructor(names: string | string[], requirements: CommandRequirements & {
        guildOnly: true;
        dmOnly?: false;
    }, process: GuildCommandProcess);
    /** Creates a command restricted to use in DMs. */
    constructor(names: string | string[], requirements: CommandRequirements & {
        dmOnly: true;
        guildOnly?: false;
    }, process: PrivateCommandProcess);
    /** Creates a command. */
    constructor(names: string | string[], requirements: CommandRequirements, process: CommandProcess);
    /**
     * Creates a command restricted to use in guilds.
     * @deprecated Use the `new Command(names, requirements, process)` form.
     */
    constructor(names: string | string[], process: GuildCommandProcess, requirements: CommandRequirements & {
        guildOnly: true;
        dmOnly?: false;
    });
    /**
     * Creates a command restricted to use in DMs.
     * @deprecated Use the `new Command(names, requirements, process)` form.
     */
    constructor(names: string | string[], process: PrivateCommandProcess, requirements: CommandRequirements & {
        dmOnly: true;
        guildOnly?: false;
    });
    /**
     * Creates a command.
     * @deprecated Use the `new Command(names, requirements, process)` form.
     */
    constructor(names: string | string[], process: CommandProcess, requirements: CommandRequirements);
    /** Checks whether or not a command can be executed. */
    checkPermissions(msg: Eris.Message, args: string[], ctx: CommandContext): Promise<boolean>;
    /**
     * Adds a subcommand to this command.
     * @param command The subcommand to add
     */
    addSubcommand(command: Command): this;
    /**
     * Checks the list of subcommands and returns one whch is known by a given
     * name. Passing an empty string will return the default command, if any.
     */
    subcommandForName(name: string, caseSensitive: boolean): Command | null;
    /** Executes the command process if the permission checks pass. */
    execute(msg: Eris.Message, args: string[], ctx: CommandContext): Promise<boolean>;
}
