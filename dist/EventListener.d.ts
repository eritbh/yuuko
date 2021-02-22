import { Client, Command, CommandContext } from './Yuuko';
import Eris from 'eris';
/** An object containing context information for processing an event. */
export interface EventContext {
    /** The client that received the event. */
    client: Client;
    /** Other keys can be added as necessary by Client#extendContext. */
    [key: string]: any;
}
/** Options for the EventListener constructor. */
export interface EventListenerOptions {
    /** If true, the listener is only called the first time the event occurs. */
    once?: boolean;
}
/** Class associating an event handler with an event. */
export declare class EventListener implements EventListenerOptions {
    /** The arguments passed to `client.on()` to register this listener */
    args: Parameters<Client["on"]>;
    /** If true, the listener is only called the first time the event occurs */
    once: boolean;
    /** The name of the file the event listener was loaded from, if any. */
    filename?: string;
    /**
     * The actual function registered to the client as the direct listener. Set
     * by the client when this instance is called by Client.addEvent. This is a
     * bit of a hack and shouldn't be relied on in its current state. If you
     * have a use case that requires access to this property, get in touch and
     * I'll see if I can improve the way this is handled to better support you.
     * @internal
     */
    computedListener?: (...args: any[]) => void;
    /** The name of the event this listener is attached to */
    get eventName(): string;
    constructor(event: "ready" | "disconnect", listener: (context: EventContext) => void, options?: EventListenerOptions);
    constructor(event: "callCreate" | "callRing" | "callDelete", listener: (call: Eris.Call, context: EventContext) => void, options?: EventListenerOptions);
    constructor(event: "callUpdate", listener: (call: Eris.Call, oldCall: Eris.OldCall, context: EventContext) => void, options?: EventListenerOptions);
    constructor(event: "channelCreate" | "channelDelete", listener: (channel: Eris.AnyChannel, context: EventContext) => void, options?: EventListenerOptions);
    constructor(event: "channelPinUpdate", listener: (channel: Eris.TextableChannel, timestamp: number, oldTimestamp: number, context: EventContext) => void, options?: EventListenerOptions);
    constructor(event: "channelRecipientAdd" | "channelRecipientRemove", listener: (channel: Eris.GroupChannel, user: Eris.User, context: EventContext) => void, options?: EventListenerOptions);
    constructor(event: "channelUpdate", listener: (channel: Eris.AnyGuildChannel, oldChannel: Eris.OldGuildChannel, context: EventContext) => void, options?: EventListenerOptions);
    constructor(event: "friendSuggestionCreate", listener: (user: Eris.User, reasons: Eris.FriendSuggestionReasons, context: EventContext) => void, options?: EventListenerOptions);
    constructor(event: "friendSuggestionDelete", listener: (user: Eris.User, context: EventContext) => void, options?: EventListenerOptions);
    constructor(event: "guildAvailable" | "guildBanAdd" | "guildBanRemove", listener: (guild: Eris.Guild, user: Eris.User, context: EventContext) => void, options?: EventListenerOptions);
    constructor(event: "guildDelete" | "guildUnavailable" | "guildCreate", listener: (guild: Eris.Guild, context: EventContext) => void, options?: EventListenerOptions);
    constructor(event: "guildEmojisUpdate", listener: (guild: Eris.Guild, emojis: Eris.Emoji[], oldEmojis: Eris.Emoji[], context: EventContext) => void, options?: EventListenerOptions);
    constructor(event: "guildMemberAdd", listener: (guild: Eris.Guild, member: Eris.Member, context: EventContext) => void, options?: EventListenerOptions);
    constructor(event: "guildMemberChunk", listener: (guild: Eris.Guild, members: Eris.Member[], context: EventContext) => void, options?: EventListenerOptions);
    constructor(event: "guildMemberRemove", listener: (guild: Eris.Guild, member: Eris.Member | Eris.MemberPartial, context: EventContext) => void, options?: EventListenerOptions);
    constructor(event: "guildMemberUpdate", listener: (guild: Eris.Guild, member: Eris.Member, oldMember: {
        roles: string[];
        nick?: string;
    }, context: EventContext) => void, options?: EventListenerOptions);
    constructor(event: "guildRoleCreate" | "guildRoleDelete", listener: (guild: Eris.Guild, role: Eris.Role, context: EventContext) => void, options?: EventListenerOptions);
    constructor(event: "guildRoleUpdate", listener: (guild: Eris.Guild, role: Eris.Role, oldRole: Eris.OldRole, context: EventContext) => void, options?: EventListenerOptions);
    constructor(event: "guildUpdate", listener: (guild: Eris.Guild, oldGuild: Eris.OldGuild, context: EventContext) => void, options?: EventListenerOptions);
    constructor(event: "hello", listener: (trace: string[], id: number, context: EventContext) => void, options?: EventListenerOptions);
    constructor(event: "inviteCreate" | "inviteDelete", listener: (guild: Eris.Guild, invite: Eris.GuildInvite, context: EventContext) => void, options?: EventListenerOptions);
    constructor(event: "messageCreate", listener: (message: Eris.Message, context: EventContext) => void, options?: EventListenerOptions);
    constructor(event: "messageDelete" | "messageReactionRemoveAll", listener: (message: Eris.PossiblyUncachedMessage, context: EventContext) => void, options?: EventListenerOptions);
    constructor(event: "messageReactionRemoveEmoji", listener: (message: Eris.PossiblyUncachedMessage, emoji: Eris.PartialEmoji, context: EventContext) => void, options?: EventListenerOptions);
    constructor(event: "messageDeleteBulk", listener: (messages: Eris.PossiblyUncachedMessage[], context: EventContext) => void, options?: EventListenerOptions);
    constructor(event: "messageReactionAdd" | "messageReactionRemove", listener: (message: Eris.PossiblyUncachedMessage, emoji: Eris.Emoji, userID: string, context: EventContext) => void, options?: EventListenerOptions);
    constructor(event: "messageUpdate", listener: (message: Eris.Message, oldMessage: Eris.OldMessage | undefined, context: EventContext) => void, options?: EventListenerOptions);
    constructor(event: "presenceUpdate", listener: (other: Eris.Member | Eris.Relationship, oldPresence: Eris.Presence | undefined, context: EventContext) => void, options?: EventListenerOptions);
    constructor(event: "rawREST", listener: (request: Eris.RawRESTRequest, context: EventContext) => void, options?: EventListenerOptions);
    constructor(event: "rawWS" | "unknown", listener: (packet: Eris.RawPacket, id: number, context: EventContext) => void, options?: EventListenerOptions);
    constructor(event: "relationshipAdd" | "relationshipRemove", listener: (relationship: Eris.Relationship, context: EventContext) => void, options?: EventListenerOptions);
    constructor(event: "relationshipUpdate", listener: (relationship: Eris.Relationship, oldRelationship: {
        type: number;
    }, context: EventContext) => void, options?: EventListenerOptions);
    constructor(event: "typingStart", listener: (channel: Eris.TextableChannel, user: Eris.User, context: EventContext) => void, options?: EventListenerOptions);
    constructor(event: "unavailableGuildCreate", listener: (guild: Eris.UnavailableGuild, context: EventContext) => void, options?: EventListenerOptions);
    constructor(event: "userUpdate", listener: (user: Eris.User, oldUser: {
        username: string;
        discriminator: string;
        avatar?: string;
    }, context: EventContext) => void, options?: EventListenerOptions);
    constructor(event: "voiceChannelJoin", listener: (member: Eris.Member, newChannel: Eris.VoiceChannel, context: EventContext) => void, options?: EventListenerOptions);
    constructor(event: "voiceChannelLeave", listener: (member: Eris.Member, oldChannel: Eris.VoiceChannel, context: EventContext) => void, options?: EventListenerOptions);
    constructor(event: "voiceChannelSwitch", listener: (member: Eris.Member, newChannel: Eris.VoiceChannel, oldChannel: Eris.VoiceChannel, context: EventContext) => void, options?: EventListenerOptions);
    constructor(event: "voiceStateUpdate", listener: (member: Eris.Member, oldState: Eris.OldVoiceState, context: EventContext) => void, options?: EventListenerOptions);
    constructor(event: "warn" | "debug", listener: (message: string, id: number, context: EventContext) => void, options?: EventListenerOptions);
    constructor(event: "shardDisconnect" | "error" | "shardPreReady" | "connect", listener: (err: Error, id: number, context: EventContext) => void, options?: EventListenerOptions);
    constructor(event: "shardReady" | "shardResume", listener: (id: number, context: EventContext) => void, options?: EventListenerOptions);
    constructor(event: 'commandLoaded', listener: (cmd: Command, context: EventContext) => void, options?: EventListenerOptions);
    constructor(event: 'preCommand', listener: (cmd: Command, msg: Eris.Message, args: string[], ctx: CommandContext, context: EventContext) => void, options?: EventListenerOptions);
    constructor(event: 'postCommand', listener: (cmd: Command, msg: Eris.Message, args: string[], ctx: CommandContext, context: EventContext) => void, options?: EventListenerOptions);
    constructor(event: 'invalidCommand', listener: (msg: Eris.Message, args: string[], ctx: CommandContext, context: EventContext) => void, options?: EventListenerOptions);
}
