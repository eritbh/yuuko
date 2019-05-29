/** @module Yuuko */

import * as Eris from 'eris';
import {Client} from './Yuuko';
import {makeArray} from './util';

/** Check if requirements are met. */
// TODO this interface is ugly
async function fulfillsRequirements (requirements: CommandRequirements, msg: Eris.Message, args: string[], ctx: CommandContext) {
	const {owner, permissions, custom} = requirements;
	const {client} = ctx;
	// Owner checking
	if (owner && client.app && client.app.owner.id !== msg.author.id) {
		return false;
	}
	// Permissions
	if (permissions && permissions.length > 0) {
		// If we require permissions, the command can't be used in direct
		// messages
		if (!(msg.channel instanceof Eris.GuildChannel)) {
			return false;
		}
		// Calculate permissions of the user and check all we need
		const memberPerms = msg.channel.permissionsOf(msg.author.id);
		for (const permission of permissions) {
			if (!memberPerms.has(permission)) {
				return false;
			}
		}
	}
	// Custom requirement function
	if (custom && !await custom(msg, args, ctx)) {
		return false;
	}
	// If we haven't returned yet, all requirements are met
	return true;
}

/** An object of requirements a user must meet to use the command. */
export interface CommandRequirements {
	/** If true, the user must be the bot's owner. */
	owner?: boolean;
	/** A list of permission strings the user must have. */
	// TODO: use a union of all the string literals we could possibly put here
	permissions?: string | string[];
	/** A custom function that must return true to enable the command. */
	custom?(msg: object, args: string[], ctx: CommandContext): boolean | Promise<boolean>;
}

/** An object containing context information for processing a command. */
export interface PartialCommandContext {
	/** The client that received the message. */
	client: Client;
}
/** An object containing context information for a command's execution. */
export interface CommandContext extends PartialCommandContext {
	/** The prefix used to call the command. */
	prefix: string;
	/** The name or alias used to call the command. */
	commandName: string | null;
}

/** The function to be called when a command is executed. */
export interface CommandProcess {
	(
		/** The message object from Eris. */
		msg: Eris.Message,
		/** A space-separated list of arguments to the command. */
		args: string[],
		/** An object containing additional context information. */
		ctx: CommandContext,
	): void;
}

export type CommandName = string | null;

/** Class representing a command. */
export class Command {
	/** The command's name. */
	name: CommandName;

	/**
	 * A list of aliases that can be used to call the command in addition to
	 * its name.
	 */
	aliases: CommandName[];

	/** The function executed when the command is triggered. */
	process: CommandProcess;

	/** The requirements for the command being triggered. */
	requirements: CommandRequirements;

	/** The name of the file the command was loaded from, if any. */
	filename?: string;

	constructor (name: CommandName | CommandName[], process: CommandProcess, requirements?: CommandRequirements) {
		if (Array.isArray(name)) {
			this.name = <CommandName>name.shift();
			this.aliases = name;
		} else {
			this.name = name;
			this.aliases = [];
		}
		if (!this.name) throw new TypeError('Name is required');
		this.process = process;
		if (!this.process) throw new TypeError('Process is required');
		this.requirements = {};
		if (requirements) {
			if (requirements.owner) {
				this.requirements.owner = true;
			}
			if (requirements.permissions) {
				this.requirements.permissions = makeArray(requirements.permissions);
			}
			if (requirements.custom) {
				this.requirements.custom = requirements.custom;
			}
		}
	}

	/** Checks whether or not a command can be executed. */
	async checkPermissions (msg: Eris.Message, args: string[], ctx: CommandContext): Promise<boolean> {
		if (!ctx.client.ignoreGlobalRequirements) {
			if (!await fulfillsRequirements(ctx.client.globalCommandRequirements, msg, args, ctx)) {
				return false;
			}
		}
		return fulfillsRequirements(this.requirements, msg, args, ctx);
	}

	/** Executes the command process if the permission checks pass. */
	async execute (msg: Eris.Message, args: string[], ctx: CommandContext): Promise<boolean> {
		if (!await this.checkPermissions(msg, args, ctx)) return false;
		this.process(msg, args, ctx);
		return true;
	}

	/** All names the command is callable by. */
	get names (): CommandName[] {
		return [this.name, ...this.aliases];
	}
}
