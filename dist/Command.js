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
exports.Command = void 0;
const Eris = __importStar(require("eris"));
const util_1 = require("./util");
/** Check if requirements are met. */
// TODO this interface is ugly
function fulfillsRequirements(requirements, msg, args, ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        const { owner, guildOnly, dmOnly, permissions, custom } = requirements;
        const { client } = ctx;
        // Owner checking
        if (owner) {
            // If the bot's application info isn't loaded, we can't confirm anything
            if (!client.app)
                return false;
            // TODO: remove <any> after https://github.com/bsian03/eris/pull/10 and
            //       https://github.com/abalabahaha/eris/pull/993
            if (client.app.team) {
                // If the bot is owned by a team, we check their ID and team role
                // (as of 2020-09-29, Admin/2 is the only role/membership_state)
                if (!client.app.team.members.some(member => member.membership_state === 2 && member.user.id === msg.author.id)) {
                    return false;
                }
            }
            else {
                // if the bot is owned by a single user, we check their ID directly
                if (client.app.owner.id !== msg.author.id) {
                    return false;
                }
            }
        }
        // Guild-only commands
        if (guildOnly) {
            if (!msg.guildID) {
                return false;
            }
        }
        // DM-only commands
        if (dmOnly) {
            if (msg.guildID) {
                return false;
            }
        }
        // Permissions
        if (permissions && permissions.length > 0) {
            // Permission checks only make sense in guild channels
            if (!(msg.channel instanceof Eris.GuildChannel)) {
                return false;
            }
            // Calculate permissions of the user and check all we need
            const memberPerms = msg.channel.permissionsOf(msg.author.id);
            for (const permission of permissions) {
                if (!memberPerms.has(permission)) {
                    return false;
                }
            }
        }
        // Custom requirement function
        if (custom && !(yield custom(msg, args, ctx))) {
            return false;
        }
        // If we haven't returned yet, all requirements are met
        return true;
    });
}
/** Class representing a command. */
class Command {
    constructor(names, process, requirements) {
        if (Array.isArray(names)) {
            this.names = names;
        }
        else {
            this.names = [names];
        }
        if (!this.names[0])
            throw new TypeError('At least one name is required');
        this.process = process;
        if (!this.process)
            throw new TypeError('Process is required');
        this.requirements = {};
        if (requirements) {
            if (requirements.owner) {
                this.requirements.owner = true;
            }
            if (requirements.permissions) {
                this.requirements.permissions = util_1.makeArray(requirements.permissions);
            }
            if (requirements.custom) {
                this.requirements.custom = requirements.custom;
            }
        }
    }
    /** Checks whether or not a command can be executed. */
    checkPermissions(msg, args, ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!ctx.client.ignoreGlobalRequirements) {
                if (!(yield fulfillsRequirements(ctx.client.globalCommandRequirements, msg, args, ctx))) {
                    return false;
                }
            }
            return fulfillsRequirements(this.requirements, msg, args, ctx);
        });
    }
    /** Executes the command process if the permission checks pass. */
    execute(msg, args, ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(yield this.checkPermissions(msg, args, ctx)))
                return false;
            // By calling checkPermissions and returning early if it returns false,
            // we guarantee that messages will be the correct type for the stored
            // process, so this call is always safe. Restructuring this to properly
            // use TS type guards would be very messy and would result in duplicate
            // safety checks that we want to avoid.
            // @ts-ignore
            this.process(msg, args, ctx);
            return true;
        });
    }
}
exports.Command = Command;
