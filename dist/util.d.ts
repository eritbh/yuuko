/** @module Yuuko */
/**
 * Turns an undefined value into an empty array, or another non-array value into
 * an array with that value as the only element
 */
export declare function makeArray<T>(thing: T | T[]): T[];
/** The resolved type of a Promise */
export declare type Resolved<T> = T extends Promise<infer U> ? U : T;
/** A type, or a Promise that resolves to that type */
export declare type Resolves<T> = T | Promise<T>;
