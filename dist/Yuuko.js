"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
// Exort all things from other files
__export(require("./Client"));
__export(require("./Command"));
// Default export is a function that returns a client, just like Eris's
const Client_1 = require("./Client");
function default_1(options) {
    return new Client_1.Client(options);
}
exports.default = default_1;
