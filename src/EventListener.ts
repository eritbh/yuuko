import { Client, Command, CommandContext } from './Yuuko';
import Eris from 'eris';

/** An object containing context information for processing an event. */
export interface EventContext {
	/** The client that received the event. */
	client: Client;
	/** Other keys can be added as necessary by Client#extendContext. */
	[key: string]: any;
}

/** Class associating an event handler with an event. */
export class EventListener {
	/** The arguments passed to `client.on()` to register this listener */
	args: Parameters<Client["on"]>;
	
	/** The name of the file the event listener was loaded from, if any. */
	filename?: string;

	// Event list pulled from Eris.EventListeners and Eris.ClientEvents typings, but converted to constructors
	constructor(event: "ready" | "disconnect", listener: (context: EventContext) => void);
	constructor(event: "callCreate" | "callRing" | "callDelete", listener: (call: Eris.Call, context: EventContext) => void);
	constructor(event: "callUpdate", listener: (call: Eris.Call, oldCall: Eris.OldCall, context: EventContext) => void);
	constructor(event: "channelCreate" | "channelDelete", listener: (channel: Eris.AnyChannel, context: EventContext) => void);
	constructor(event: "channelPinUpdate", listener: (channel: Eris.TextableChannel, timestamp: number, oldTimestamp: number, context: EventContext) => void);
	constructor(event: "channelRecipientAdd" | "channelRecipientRemove", listener: (channel: Eris.GroupChannel, user: Eris.User, context: EventContext) => void);
	constructor(event: "channelUpdate", listener: (channel: Eris.AnyGuildChannel, oldChannel: Eris.OldGuildChannel, context: EventContext) => void);
	constructor(event: "friendSuggestionCreate", listener: (user: Eris.User, reasons: Eris.FriendSuggestionReasons, context: EventContext) => void);
	constructor(event: "friendSuggestionDelete", listener: (user: Eris.User, context: EventContext) => void);
	constructor(event: "guildAvailable" | "guildBanAdd" | "guildBanRemove", listener: (guild: Eris.Guild, user: Eris.User, context: EventContext) => void);
	constructor(event: "guildDelete" | "guildUnavailable" | "guildCreate", listener: (guild: Eris.Guild, context: EventContext) => void);
	constructor(event: "guildEmojisUpdate", listener: (guild: Eris.Guild, emojis: Eris.Emoji[], oldEmojis: Eris.Emoji[], context: EventContext) => void);
	constructor(event: "guildMemberAdd", listener: (guild: Eris.Guild, member: Eris.Member, context: EventContext) => void);
	constructor(event: "guildMemberChunk", listener: (guild: Eris.Guild, members: Eris.Member[], context: EventContext) => void);
	constructor(event: "guildMemberRemove", listener: (guild: Eris.Guild, member: Eris.Member | Eris.MemberPartial, context: EventContext) => void);
	constructor(event: "guildMemberUpdate", listener: (guild: Eris.Guild, member: Eris.Member, oldMember: { roles: string[]; nick?: string }, context: EventContext) => void);
	constructor(event: "guildRoleCreate" | "guildRoleDelete", listener: (guild: Eris.Guild, role: Eris.Role, context: EventContext) => void);
	constructor(event: "guildRoleUpdate", listener: (guild: Eris.Guild, role: Eris.Role, oldRole: Eris.OldRole, context: EventContext) => void);
	constructor(event: "guildUpdate", listener: (guild: Eris.Guild, oldGuild: Eris.OldGuild, context: EventContext) => void);
	constructor(event: "hello", listener: (trace: string[], id: number, context: EventContext) => void);
	constructor(event: "inviteCreate" | "inviteDelete", listener: (guild: Eris.Guild, invite: Eris.GuildInvite, context: EventContext) => void);
	constructor(event: "messageCreate", listener: (message: Eris.Message, context: EventContext) => void);
	constructor(event: "messageDelete" | "messageReactionRemoveAll", listener: (message: Eris.PossiblyUncachedMessage, context: EventContext) => void);
	constructor(event: "messageReactionRemoveEmoji", listener: (message: Eris.PossiblyUncachedMessage, emoji: Eris.PartialEmoji, context: EventContext) => void);
	constructor(event: "messageDeleteBulk", listener: (messages: Eris.PossiblyUncachedMessage[], context: EventContext) => void);
	constructor(event: "messageReactionAdd" | "messageReactionRemove", listener: (message: Eris.PossiblyUncachedMessage, emoji: Eris.Emoji, userID: string, context: EventContext) => void);
	constructor(event: "messageUpdate", listener: (message: Eris.Message, oldMessage: Eris.OldMessage | undefined, context: EventContext) => void);
	constructor(event: "presenceUpdate", listener: (other: Eris.Member | Eris.Relationship, oldPresence: Eris.Presence | undefined, context: EventContext) => void);
	constructor(event: "rawREST", listener: (request: Eris.RawRESTRequest, context: EventContext) => void);
	constructor(event: "rawWS" | "unknown", listener: (packet: Eris.RawPacket, id: number, context: EventContext) => void);
	constructor(event: "relationshipAdd" | "relationshipRemove", listener: (relationship: Eris.Relationship, context: EventContext) => void);
	constructor(event: "relationshipUpdate", listener: (relationship: Eris.Relationship, oldRelationship: { type: number }, context: EventContext) => void);
	constructor(event: "typingStart", listener: (channel: Eris.TextableChannel, user: Eris.User, context: EventContext) => void);
	constructor(event: "unavailableGuildCreate", listener: (guild: Eris.UnavailableGuild, context: EventContext) => void);
	constructor(event: "userUpdate", listener: (user: Eris.User, oldUser: { username: string; discriminator: string; avatar?: string }, context: EventContext) => void);
	constructor(event: "voiceChannelJoin", listener: (member: Eris.Member, newChannel: Eris.VoiceChannel, context: EventContext) => void);
	constructor(event: "voiceChannelLeave", listener: (member: Eris.Member, oldChannel: Eris.VoiceChannel, context: EventContext) => void);
	constructor(event: "voiceChannelSwitch", listener: (member: Eris.Member, newChannel: Eris.VoiceChannel, oldChannel: Eris.VoiceChannel, context: EventContext) => void);
	constructor(event: "voiceStateUpdate", listener: (member: Eris.Member, oldState: Eris.OldVoiceState, context: EventContext) => void);
	constructor(event: "warn" | "debug", listener: (message: string, id: number, context: EventContext) => void);
	constructor(event: "shardDisconnect" | "error" | "shardPreReady" | "connect",listener: (err: Error, id: number, context: EventContext) => void);
	constructor(event: "shardReady" | "shardResume", listener: (id: number, context: EventContext) => void);

	// Yuuko client events ripped from Client.ts
	constructor (event: 'commandLoaded', listener: (cmd: Command, context: EventContext) => void);
	constructor (event: 'preCommand', listener: (cmd: Command, msg: Eris.Message, args: string[], ctx: CommandContext, context: EventContext) => void);
	constructor (event: 'postCommand', listener: (cmd: Command, msg: Eris.Message, args: string[], ctx: CommandContext, context: EventContext) => void);
	constructor (event: 'invalidCommand', listener: (msg: Eris.Message, args: string[], ctx: CommandContext, context: EventContext) => void);

	constructor(event: string, listener: Function) {
		this.args = [event, listener];
	}
}
