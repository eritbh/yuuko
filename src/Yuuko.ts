/** @module Yuuko */

// Export all things from other files
export * from './Client';
export * from './Command';
export * from './EventListener';

export * from './argumentParsing';
export * from './argumentTypes/IntegerArgument';
export * from './argumentTypes/NumberArgument';

// Also export plain Eris for convenience working with its types/etc
import * as Eris from 'eris';
export {Eris};
