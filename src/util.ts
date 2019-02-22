/** @module Yuuko */

export function makeArray<T> (thing: T | T[]): T[] {
	if (Array.isArray(thing)) {
		return thing;
	} else if (thing === undefined) {
		return [];
	}
	return [thing];
}
