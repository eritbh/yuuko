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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Yuuko_1 = require("../Yuuko");
const util = __importStar(require("util"));
const inspectOptions = {
    depth: 1,
};
// eslint-disable-next-line
exports.default = new Yuuko_1.Command('debug', function debug(msg, args, ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        // Parse out code blocks
        let string = args.join(' ').replace(/^\s+/, '').replace(/\s*$/, '');
        if (string.startsWith('```') && string.endsWith('```')) {
            string = string.substring(3, string.length - 3);
            if (string.startsWith('js')) {
                string = string.substr(2);
            }
        }
        // Create a dummy console object
        const console = {
            _lines: [],
            _logger(...things) {
                this._lines.push(...things.join(' ').split('\n'));
            },
            _formatLines() {
                return this._lines.map(line => line && `//> ${line}\n`).join('');
            },
        };
        // eslint-disable-next-line no-multi-assign
        console.log = console.error = console.warn = console.info = console._logger.bind(console);
        // eslint-disable-next-line
        const c = console; // Convenience
        // Eval the things and send the results
        let result;
        try {
            result = eval(string); // eslint-disable-line no-eval
        }
        catch (e) {
            result = e;
        }
        const message = `\`\`\`js\n${console._formatLines()}${util.inspect(result, inspectOptions)}\n\`\`\``;
        // Send the message
        let outputMsg;
        try {
            outputMsg = yield msg.channel.createMessage(message);
        }
        catch (err) {
            try {
                msg.channel.createMessage(`Error sending message:\n\`\`\`\n${err}\n\`\`\``);
            }
            catch (_a) {
                // pass
            }
            return;
        }
        // We returned a promise?
        if (result && typeof result.then === 'function') {
            // Sweet. Wait for that to resolve.
            let value;
            try {
                value = util.inspect(yield result, inspectOptions);
            }
            catch (err) {
                value = err;
            }
            // Now we can edit the message with the promise's resolved result(s).
            const newContent = outputMsg.content.split('\n');
            newContent.splice(-1, 0, '// Resolved to:', value);
            try {
                yield outputMsg.edit(newContent.join('\n'));
            }
            catch (_) {
                newContent.splice(-2, 1, '(content too long)');
                outputMsg.edit(newContent.join('\n')).catch(() => { });
            }
        }
    });
}, {
    owner: true,
});
