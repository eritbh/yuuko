"use strict";
/** @module Yuuko */
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeArray = void 0;
/**
 * Turns an undefined value into an empty array, or another non-array value into
 * an array with that value as the only element
 */
function makeArray(thing) {
    if (Array.isArray(thing)) {
        return thing;
    }
    else if (thing === undefined) {
        return [];
    }
    return [thing];
}
exports.makeArray = makeArray;
