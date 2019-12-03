"use strict";
/** @module Yuuko */
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
// Exort all things from other files
__export(require("./Client"));
__export(require("./Command"));
// Also export plain Eris for convenience working with its types/etc
const Eris = __importStar(require("eris"));
exports.Eris = Eris;
