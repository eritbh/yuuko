/** @module Yuuko */
import { Command, CommandProcess, CommandRequirements, GuildCommandProcess, PrivateCommandProcess } from '../Yuuko';
export interface CommandHelp {
    desc?: string;
    args?: string;
}
export declare class CommandWithHelp extends Command {
    help: CommandHelp;
    constructor(names: string | string[], help: CommandHelp, process: CommandProcess, requirements?: CommandRequirements);
    constructor(names: string | string[], help: CommandHelp, process: GuildCommandProcess, requirements: CommandRequirements & {
        guildOnly: true;
        dmOnly?: false;
    });
    constructor(names: string | string[], help: CommandHelp, process: PrivateCommandProcess, requirements: CommandRequirements & {
        dmOnly: true;
        guildOnly?: false;
    });
}
declare const helpCommand: Command;
export default helpCommand;
