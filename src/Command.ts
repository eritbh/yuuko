/** @module Yuuko */

import * as Eris from 'eris';
import {EventContext} from './Yuuko';
import {makeArray} from './util';

/** Check if requirements are met. */
// TODO this interface is ugly
async function fulfillsRequirements (requirements: CommandRequirements, msg: Eris.Message, args: string[], ctx: CommandContext) {
	const {owner, guildOnly, dmOnly, permissions, custom} = requirements;
	const {client} = ctx;

	// Owner checking
	if (owner) {
		// If the bot's application info isn't loaded, we can't confirm anything
		if (!client.app) return false;

		if (client.app.team) {
			// If the bot is owned by a team, we check their ID and team role
			// (as of 2020-09-29, Admin/2 is the only role/membership_state)
			// TODO: Remove type assertion after abalabahaha/eris#1171
			if (!(client.app.team.members as unknown as Eris.OAuthTeamMember[]).some(member => member.membership_state === 2 && member.user.id === msg.author.id)) {
				return false;
			}
		} else if (client.app.owner.id !== msg.author.id) {
			// If the bot is owned by a single user, we check their ID directly
			return false;
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
		ctx: CommandContext,
	): void;
}

export type GuildCommandProcess = CommandProcess<Eris.GuildTextableChannel>;
export type PrivateCommandProcess = CommandProcess<Eris.PrivateChannel>;

/** Class representing a command. */
export class Command {
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
	subcommands: Command[] = [];

	/** Creates a command restricted to use in guilds. */
	constructor (names: string | string[], process: GuildCommandProcess, requirements: CommandRequirements & { guildOnly: true; dmOnly?: false });
	/** Creates a command restricted to use in DMs. */
	constructor (names: string | string[], process: PrivateCommandProcess, requirements: CommandRequirements & { dmOnly: true; guildOnly?: false });
	/** Creates a command. */
	constructor (names: string | string[], process: CommandProcess, requirements?: CommandRequirements);

	/**
	 * This implememtation signature is really messy to account for all the
	 * different forms the constructor can take. It doesn't need to be exposed
	 * in documentation or code suggestions.
	 * @internal
	 */
	constructor (names: string | string[], process: CommandProcess | GuildCommandProcess | PrivateCommandProcess, requirements?: CommandRequirements) {
		if (Array.isArray(names)) {
			this.names = names;
		} else {
			this.names = [names];
		}
		if (!this.names[0]) throw new TypeError('At least one name is required');

		// NOTE: This cast discards away type information related to the
		//       channels we expect this command to be executed in. The only
		//       thing preventing e.g. private channel messages from being
		//       passed to a guild-only command process are the runtime checks
		//       in Command#execute below.
		this.process = process as CommandProcess<Eris.TextableChannel>;
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

	/**
	 * Adds a subcommand to this command.
	 * @param command The subcommand to add
	 */
	addSubcommand (command: Command): this {
		for (const name of command.names) {
			for (const otherCommand of this.subcommands) {
				if (otherCommand.names.includes(name)) {
					throw new TypeError(`Two commands have the same name: ${name}`);
				}
			}
		}
		this.subcommands.push(command);
		return this;
	}

	/**
	 * Checks the list of subcommands and returns one whch is known by a given
	 * name. Passing an empty string will return the default command, if any.
	 */
	subcommandForName (name: string, caseSensitive: boolean): Command | null {
		if (caseSensitive) return this.subcommands.find(c => c.names.includes(name)) || null;
		return this.subcommands.find(c => c.names.some(n => n.toLowerCase() === name.toLowerCase())) || null;
	}

	/** Executes the command process if the permission checks pass. */
	async execute (msg: Eris.Message, args: string[], ctx: CommandContext): Promise<boolean> {
		if (!await this.checkPermissions(msg, args, ctx)) return false;

		// Check if we have a subcommand, and if so, execute that command
		if (args.length) {
			const subcommand = this.subcommandForName(args[0], ctx.client.caseSensitiveCommands);
			if (subcommand) {
				// TODO: Might want to handle this as an array instead, but doing it
				//       this way for now for backwards compatibility
				ctx.commandName += ` ${args.shift()}`;
				return subcommand.execute(msg, args, ctx);
			}
		}

		// We have no subcommand, so call this command's process
		// NOTE: By calling checkPermissions and returning early if it returns
		//       false, we guarantee that messages will be the correct type for
		//       the stored process, even though we no longer have type info
		//       about the process.
		this.process(msg, args, ctx);
		return true;
	}
}
