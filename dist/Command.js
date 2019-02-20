"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Eris = __importStar(require("eris"));
/**
 * @skip
 * Takes an object and returns it inside an array, or unmodified if it is
 * already an array. If undefined is passed, an empty array is returned.
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
/** Class representing a command. */
class Command {
    constructor(name, process, requirements) {
        if (Array.isArray(name)) {
            this.name = name.shift();
            this.aliases = name;
        }
        else {
            this.name = name;
            this.aliases = [];
        }
        if (!this.name)
            throw new TypeError('Name is required');
        this.process = process;
        if (!this.process)
            throw new TypeError('Process is required');
        this.requirements = {};
        if (requirements) {
            if (requirements.owner) {
                this.requirements.owner = true;
            }
            if (requirements.permissions) {
                this.requirements.permissions = makeArray(requirements.permissions);
            }
            if (requirements.custom) {
                this.requirements.custom = requirements.custom;
            }
        }
    }
    /** Checks whether or not a command can be executed. */
    checkPermissions(msg, args, ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const { client } = ctx;
            const { owner, permissions, custom } = this.requirements;
            // Owner checking
            if (owner && client.app && client.app.owner.id !== msg.author.id) {
                return false;
            }
            // Permissions
            if (permissions && permissions.length > 0) {
                // If we require permissions, the command can't be used in direct
                // messages
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
    /** Executes the command process if the permission checks pass. */
    execute(msg, args, ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(yield this.checkPermissions(msg, args, ctx)))
                return;
            this.process(msg, args, ctx);
        });
    }
    /** All names the command is callable by. */
    get names() {
        return [this.name, ...this.aliases];
    }
}
exports.Command = Command;
