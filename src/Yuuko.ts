/** @module Yuuko */

// Exort all things from other files
export * from './Client';
export * from './Command';

// Also export plain Eris for convenience working with its types/etc
import * as Eris from 'eris';
export {Eris};

// Export a namespace for default commands as well
import debugCommand from './commands/debug';
import helpCommand from './commands/help';
import reloadCommand from './commands/reload';
import setavatarCommand from './commands/setavatar';
import setnameCommand from './commands/setname';
import setstatusCommand from './commands/setstatus';
export namespace defaultCommands {
	export const debug = debugCommand;
	export const help = helpCommand;
	export const reload = reloadCommand;
	export const setavatar = setavatarCommand;
	export const setname = setnameCommand;
	export const setstatus = setstatusCommand;
}
