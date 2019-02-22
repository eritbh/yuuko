"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
