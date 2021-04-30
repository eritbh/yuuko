"use strict";
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
const Yuuko_1 = require("../../Yuuko");
Yuuko_1.registerArgumentType('member', (args, { me, guild, }) => __awaiter(void 0, void 0, void 0, function* () {
    if (!args.length) {
        throw new Error('Not enough arguments');
    }
    // The "me" keyword, if we're provided with a context for it
    if (me && args[0].toLowerCase() === 'me') {
        args.shift();
        return me;
    }
    let match;
    // Mentions and straight IDs
    match = args[0].match(/^(?:<@!?)?(\d+)>?(?:\s+|$)/);
    if (match) {
        const member = guild.members.get(match[1]) || (yield guild.getRESTMember(match[1]).catch(() => undefined));
        if (member) {
            args.shift();
            return member;
        }
    }
    // User tags (name#discrim)
    match = args[0].match(/^([^#]{2,32})#(\d{4})(?:\s+|$)/);
    if (match) {
        const member = guild.members.find(m => m.username === match[1] && m.discriminator === match[2]);
        if (member) {
            args.shift();
            return member;
        }
    }
    // Found nothing
    throw new Error('No member found');
}));
