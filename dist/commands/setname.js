"use strict";
/** @module Yuuko */
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
exports.default = new Yuuko_1.Command('setname', (msg, args, { client }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        msg.channel.sendTyping();
        yield client.editSelf({ username: args.join(' ') });
        yield msg.channel.createMessage('Username updated!');
    }
    catch (err) {
        try {
            msg.channel.createMessage(`There was an error while changing username.\n\`\`\`\n${err.message}\n\`\`\``);
        }
        catch (_a) {
            // pass
        }
    }
}), {
    owner: true,
});
