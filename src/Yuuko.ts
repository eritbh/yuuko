/** @module Yuuko */

// Exort all things from other files
export * from './Client';
export * from './Command';

// Also export plain Eris for convenience working with its types/etc
import * as Eris from 'eris';
export {Eris};

// Export a namespace for default commands as well
import helpCommand from './commands/help';
import debugCommand from './commands/debug';
namespace defaultCommands {
	export const help = helpCommand;
	export const debug = debugCommand;
}
export {defaultCommands};
