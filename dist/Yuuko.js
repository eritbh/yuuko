"use strict";
/** @module Yuuko */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Eris = void 0;
// Export all things from other files
// Main classes
__exportStar(require("./Client"), exports);
__exportStar(require("./Command"), exports);
__exportStar(require("./EventListener"), exports);
// Argument parsing core
__exportStar(require("./argumentParsing"), exports);
// Argument types for basic values
__exportStar(require("./argumentTypes/basic/IntegerArgument"), exports);
__exportStar(require("./argumentTypes/basic/NumberArgument"), exports);
// Argument types for Discord stuff
__exportStar(require("./argumentTypes/discord/MemberArgument"), exports);
// Also export plain Eris for convenience working with its types/etc
const Eris = __importStar(require("eris"));
exports.Eris = Eris;
