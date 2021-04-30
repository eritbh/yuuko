import Eris from 'eris';
import { ArgumentType } from '../../Yuuko';
export declare type MemberArgument = ArgumentType<{
    type: 'member';
    /** If provided, the word "me" will be interpreted the given member. */
    me?: Eris.Member;
    /** The guild to search for the member in. */
    guild: Eris.Guild;
}, Eris.Member>;
