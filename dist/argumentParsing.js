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
exports.parseArgs = exports.registerArgumentType = void 0;
// A map containing all argument parsers registered
const argResolvers = new Map();
/** Registers a custom argument type for use with `parseArgs` */
function registerArgumentType(id, func) {
    // We're storing parsers as generic ArgumentResolvers, rather than their
    // more specific "true" types. Type safety is still guaranteed since we've
    // checked the type string here and we check the type string again when
    // calling `parseArgs`, ensuring that the "true" type of the resolver here
    // will always match the type expected by the parsing code.
    argResolvers.set(id, func);
}
exports.registerArgumentType = registerArgumentType;
function parseArgs(args, specifiers) {
    return __awaiter(this, void 0, void 0, function* () {
        const returnValues = [];
        for (const specifier of specifiers) {
            const resolver = argResolvers.get(specifier.type);
            if (!resolver) {
                throw new Error(`No resolver for type ${specifier.type}`);
            }
            try {
                // Resolvers must be processed serially since they modify the `args`
                // array, and changes need to be reflected for the next resolver
                // eslint-disable-next-line no-await-in-loop
                returnValues.push(yield resolver(args, specifier));
            }
            catch (error) {
                // The resolver threw - re-throw the error, adding context
                error.specifier = specifier;
                error.argIndex = specifiers.indexOf(specifier);
                throw error;
            }
        }
        return returnValues;
    });
}
exports.parseArgs = parseArgs;
