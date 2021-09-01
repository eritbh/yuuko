"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setstatus = exports.setname = exports.reload = exports.help = exports.debug = void 0;
var debug_1 = require("./debug");
Object.defineProperty(exports, "debug", { enumerable: true, get: function () { return __importDefault(debug_1).default; } });
var help_1 = require("./help");
Object.defineProperty(exports, "help", { enumerable: true, get: function () { return __importDefault(help_1).default; } });
var reload_1 = require("./reload");
Object.defineProperty(exports, "reload", { enumerable: true, get: function () { return __importDefault(reload_1).default; } });
var setname_1 = require("./setname");
Object.defineProperty(exports, "setname", { enumerable: true, get: function () { return __importDefault(setname_1).default; } });
var setstatus_1 = require("./setstatus");
Object.defineProperty(exports, "setstatus", { enumerable: true, get: function () { return __importDefault(setstatus_1).default; } });
