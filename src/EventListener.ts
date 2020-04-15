import { Client } from './Client';
import Eris from 'eris';

/** Class associating an event handler with an event. */
export class EventListener {
	args: Parameters<Client["on"]>;

	// Event list pulled from Eris.EventListeners and Eris.ClientEvents typings, but converted to constructors
	constructor(event: "ready" | "disconnect", listener: () => void);
	constructor(event: "callCreate" | "callRing" | "callDelete", listener: (call: Eris.Call) => void);
	constructor(event: "callUpdate", listener: (call: Eris.Call, oldCall: Eris.OldCall) => void);
	constructor(event: "channelCreate" | "channelDelete", listener: (channel: Eris.AnyChannel) => void);
	constructor(event: "channelPinUpdate", listener: (channel: Eris.TextableChannel, timestamp: number, oldTimestamp: number) => void);
	constructor(event: "channelRecipientAdd" | "channelRecipientRemove", listener: (channel: Eris.GroupChannel, user: Eris.User) => void);
	constructor(event: "channelUpdate", listener: (channel: Eris.AnyGuildChannel, oldChannel: Eris.OldGuildChannel) => void);
	constructor(event: "friendSuggestionCreate", listener: (user: Eris.User, reasons: Eris.FriendSuggestionReasons) => void);
	constructor(event: "friendSuggestionDelete", listener: (user: Eris.User) => void);
	constructor(event: "guildAvailable" | "guildBanAdd" | "guildBanRemove", listener: (guild: Eris.Guild, user: Eris.User) => void);
	constructor(event: "guildDelete" | "guildUnavailable" | "guildCreate", listener: (guild: Eris.Guild) => void);
	constructor(event: "guildEmojisUpdate", listener: (guild: Eris.Guild, emojis: Eris.Emoji[], oldEmojis: Eris.Emoji[]) => void);
	constructor(event: "guildMemberAdd", listener: (guild: Eris.Guild, member: Eris.Member) => void);
	constructor(event: "guildMemberChunk", listener: (guild: Eris.Guild, members: Eris.Member[]) => void);
	constructor(event: "guildMemberRemove", listener: (guild: Eris.Guild, member: Eris.Member | Eris.MemberPartial) => void);
	constructor(event: "guildMemberUpdate", listener: (guild: Eris.Guild, member: Eris.Member, oldMember: { roles: string[]; nick?: string }) => void);
	constructor(event: "guildRoleCreate" | "guildRoleDelete", listener: (guild: Eris.Guild, role: Eris.Role) => void);
	constructor(event: "guildRoleUpdate", listener: (guild: Eris.Guild, role: Eris.Role, oldRole: Eris.OldRole) => void);
	constructor(event: "guildUpdate", listener: (guild: Eris.Guild, oldGuild: Eris.OldGuild) => void);
	constructor(event: "hello", listener: (trace: string[], id: number) => void);
	constructor(event: "inviteCreate" | "inviteDelete", listener: (guild: Eris.Guild, invite: Eris.Invite) => void);
	constructor(event: "messageCreate", listener: (message: Eris.Message) => void);
	constructor(event: "messageDelete" | "messageReactionRemoveAll", listener: (message: Eris.PossiblyUncachedMessage) => void);
	constructor(event: "messageReactionRemoveEmoji", listener: (message: Eris.PossiblyUncachedMessage, emoji: Eris.PartialEmoji) => void);
	constructor(event: "messageDeleteBulk", listener: (messages: Eris.PossiblyUncachedMessage[]) => void);
	constructor(event: "messageReactionAdd" | "messageReactionRemove", listener: (message: Eris.PossiblyUncachedMessage, emoji: Eris.Emoji, userID: string) => void);
	constructor(event: "messageUpdate", listener: (message: Eris.Message, oldMessage?: Eris.OldMessage) => void);
	constructor(event: "presenceUpdate", listener: (other: Eris.Member | Eris.Relationship, oldPresence?: Eris.Presence) => void);
	constructor(event: "rawWS" | "unknown", listener: (packet: Eris.RawPacket, id: number) => void);
	constructor(event: "relationshipAdd" | "relationshipRemove", listener: (relationship: Eris.Relationship) => void);
	constructor(event: "relationshipUpdate", listener: (relationship: Eris.Relationship, oldRelationship: { type: number }) => void);
	constructor(event: "typingStart", listener: (channel: Eris.TextableChannel, user: Eris.User) => void);
	constructor(event: "unavailableGuildCreate", listener: (guild: Eris.UnavailableGuild) => void);
	constructor(event: "userUpdate", listener: (user: Eris.User, oldUser: { username: string; discriminator: string; avatar?: string }) => void);
	constructor(event: "voiceChannelJoin", listener: (member: Eris.Member, newChannel: Eris.VoiceChannel) => void);
	constructor(event: "voiceChannelLeave", listener: (member: Eris.Member, oldChannel: Eris.VoiceChannel) => void);
	constructor(event: "voiceChannelSwitch", listener: (member: Eris.Member, newChannel: Eris.VoiceChannel, oldChannel: Eris.VoiceChannel) => void);
	constructor(event: "voiceStateUpdate", listener: (member: Eris.Member, oldState: Eris.OldVoiceState) => void);
	constructor(event: "warn" | "debug", listener: (message: string, id: number) => void);
	constructor(event: "shardDisconnect" | "error" | "shardPreReady" | "connect",listener: (err: Error, id: number) => void);
	constructor(event: "shardReady" | "shardResume", listener: (id: number) => void);

	constructor(event: string, listener: Function) {
		this.args = [event, listener];
	}
}
