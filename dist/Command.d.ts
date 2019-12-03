/** @module Yuuko */
import * as Eris from 'eris';
import { Client } from './Yuuko';
/** An object of requirements a user must meet to use the command. */
export interface CommandRequirements {
    /** If true, the user must be the bot's owner. */
    owner?: boolean;
    /** A list of permission strings the user must have. */
    permissions?: string | string[];
    /** A custom function that must return true to enable the command. */
    custom?(msg: Eris.Message, args: string[], ctx: CommandContext): boolean | Promise<boolean>;
}
/** An object containing context information for processing a command. */
export interface PartialCommandContext {
    /** The client that received the message. */
    client: Client;
    /** Other keys can be added as necessary by Client#extendContext. */
    [key: string]: any;
}
/** An object containing context information for a command's execution. */
export interface CommandContext extends PartialCommandContext {
    /** The prefix used to call the command. */
    prefix: string;
    /** The name or alias used to call the command. */
    commandName?: string;
}
/** The function to be called when a command is executed. */
export interface CommandProcess {
    (
    /** The message object from Eris. */
    msg: Eris.Message, 
    /** A space-separated list of arguments to the command. */
    args: string[], 
    /** An object containing additional context information. */
    ctx: CommandContext): void;
}
/** Class representing a command. */
export declare class Command {
    /**
     * A list of the command's names. The first should be considered the
     * command's canonical or display name.
     */
    names: string[];
    /** The function executed when the command is triggered. */
    process: CommandProcess;
    /** The requirements for the command being triggered. */
    requirements: CommandRequirements;
    /** The name of the file the command was loaded from, if any. */
    filename?: string;
    constructor(names: string | string[], process: CommandProcess, requirements?: CommandRequirements);
    /** Checks whether or not a command can be executed. */
    checkPermissions(msg: Eris.Message, args: string[], ctx: CommandContext): Promise<boolean>;
    /** Executes the command process if the permission checks pass. */
    execute(msg: Eris.Message, args: string[], ctx: CommandContext): Promise<boolean>;
}
