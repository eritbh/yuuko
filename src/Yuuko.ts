/** @module Yuuko */

// Exort all things from other files
export * from './Client';
export * from './Command';

// Also export plain Eris for convenience working with its types/etc
import * as Eris from 'eris';
export {Eris};
