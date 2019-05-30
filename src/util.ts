/** @module Yuuko */

/**
 * Turns an undefined value into an empty array, or another non-array value into
 * an array with that value as the only element
 */
export function makeArray<T> (thing: T | T[]): T[] {
	if (Array.isArray(thing)) {
		return thing;
	} else if (thing === undefined) {
		return [];
	}
	return [thing];
}

/** The resolved type of a Promise */
export type Resolved<T> = T extends Promise<infer U> ? U : T
/** A type, or a Promise that resolves to that type */
export type Resolves<T> = T | Promise<T>
