/** @module Yuuko */

import * as Eris from 'eris';
import { EventContext } from './Yuuko';
import { makeArray } from './util';

/** Check if requirements are met. */
// TODO this interface is ugly
async function fulfillsRequirements(requirements: CommandRequirements, msg: Eris.Message, args: string[], ctx: CommandContext) {
	const { owner, guildOnly, dmOnly, permissions, custom } = requirements;
	const { client } = ctx;

	// Owner checking
	if (owner) {
		// If the bot's application info isn't loaded, we can't confirm anything
		if (!client.app) return false;

		// TODO: remove <any> after https://github.com/bsian03/eris/pull/10 and
		//       https://github.com/abalabahaha/eris/pull/993
		if ((<any>client.app).team) {
			// If the bot is owned by a team, we check their ID and team role
			// (as of 2020-09-29, Admin/2 is the only role/membership_state)
			if (!(<any>client.app).team.members.some(member => member.membership_state === 2 && member.id === msg.author.id)) {
				return false;
			}
		} else {
			// if the bot is owned by a single user, we check their ID directly
			if (client.app.owner.id !== msg.author.id) {
				return false;
			}
		}
	}

	// Guild-only commands
	if (guildOnly) {
		if (!msg.guildID) {
			return false;
		}
	}

	// DM-only commands
	if (dmOnly) {
		if (msg.guildID) {
			return false;
		}
	}

	// Permissions
	if (permissions && permissions.length > 0) {
		// Permission checks only make sense in guild channels
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
	/** If true, the message must be sent in a server channel. */
	guildOnly?: boolean;
	/** If true, the message must be sent in a DM channel. */
	dmOnly?: boolean;
	/**
	 * A list of permission strings the user must have. If set, the `guildOnly`
	 * option is implied.
	 */
	// TODO: use a union of all the string literals we could possibly put here
	permissions?: string | string[];
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
		ctx: CommandContext,
	): void;
}

// These are slightly silly but they work. Not exposed because there's probably
// a cleaner way to do this, so hopefully they won't be around for long.
type GuildCommandProcess = CommandProcess<Eris.GuildTextableChannel>;
type PrivateCommandProcess = CommandProcess<Eris.PrivateChannel>;

/** Class representing a command. */
export class Command {
	/**
	 * A list of the command's names. The first should be considered the
	 * command's canonical or display name. All characters must be lowercase if
	 * the client option `caseSensitiveCommands` is false or unset.
	 */
	names: string[];

	/** The function executed when the command is triggered. */
	process: CommandProcess | GuildCommandProcess | PrivateCommandProcess

	/** The requirements for the command being triggered. */
	requirements: CommandRequirements;

	/** The name of the file the command was loaded from, if any. */
	filename?: string;

	// For some reason, I cannot get TS to recognize that `CommandProcess` is a
	// superset of `GuildCommandProcess` and `PrivateCommandProcess`, so for
	// now we have one more override than we should really need. Oh well.
	// TODO: Does microsoft/typescript#31023 fix this?
	constructor(names: string | string[], process: CommandProcess, requirements?: CommandRequirements);
	constructor(names: string | string[], process: GuildCommandProcess, requirements: CommandRequirements & { guildOnly: true, dmOnly?: false });
	constructor(names: string | string[], process: PrivateCommandProcess, requirements: CommandRequirements & { dmOnly: true, guildOnly?: false })
	constructor(names: string | string[], process: CommandProcess | GuildCommandProcess | PrivateCommandProcess, requirements?: CommandRequirements) {
		if (Array.isArray(names)) {
			this.names = names;
		} else {
			this.names = [names];
		}
		if (!this.names[0]) throw new TypeError('At least one name is required');
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
	async checkPermissions(msg: Eris.Message, args: string[], ctx: CommandContext): Promise<boolean> {
		if (!ctx.client.ignoreGlobalRequirements) {
			if (!await fulfillsRequirements(ctx.client.globalCommandRequirements, msg, args, ctx)) {
				return false;
			}
		}
		return fulfillsRequirements(this.requirements, msg, args, ctx);
	}

	/** Executes the command process if the permission checks pass. */
	async execute(msg: Eris.Message, args: string[], ctx: CommandContext): Promise<boolean> {
		if (!await this.checkPermissions(msg, args, ctx)) return false;
		// By calling checkPermissions and returning early if it returns false,
		// we guarantee that messages will be the correct type for the stored
		// process, so this call is always safe. Restructuring this to properly
		// use TS type guards would be very messy and would result in duplicate
		// safety checks that we want to avoid.
		// @ts-ignore
		this.process(msg, args, ctx);
		return true;
	}
}
