/** @module Yuuko */

/**
 * Turns an undefined value into an empty array, or another non-array value into
 * an array with that value as the only element
 *
 * @param thing
 */
export function makeArray<T> (thing: T | T[]): T[] {
	if (Array.isArray(thing)) {
		return thing;
	} else if (thing === undefined) {
		return [];
	}
	return [thing];
}

/** Helper to get the resolved type of a Promise */
export type Resolved<T> = T extends Promise<infer U> ? U : T;
