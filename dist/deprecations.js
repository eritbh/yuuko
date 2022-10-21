"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultPrefix = exports.ignoreGlobalRequirements = exports.setGlobalRequirements = exports.reloadCommands = exports.addCommandFile = exports.addCommandDir = void 0;
const process_1 = require("process");
function warningEmitter(warning, code) {
    let hasWarned = false;
    return () => {
        if (hasWarned)
            return;
        hasWarned = true;
        process_1.emitWarning(warning, 'DeprecationWarning', code);
    };
}
// https://github.com/eritbh/yuuko/issues/88
exports.addCommandDir = warningEmitter('Client#addCommandDir is deprecated. Use Client#addDir instead.', 'yuuko#88');
exports.addCommandFile = warningEmitter('Client#addCommandFile is deprecated. Use Client#addFile instead.', 'yuuko#88');
exports.reloadCommands = warningEmitter('Client#reloadCommands is deprecated. Use Client#reloadFiles instead.', 'yuuko#88');
// https://github.com/eritbh/yuuko/issues/89
exports.setGlobalRequirements = warningEmitter('Client#setGlobalRequirements is deprecated. Use the globalCommandRequirements client option instead.', 'yuuko#89');
exports.ignoreGlobalRequirements = warningEmitter('The ignoreGlobalRequirements client option is deprecated. Pass no globalCommandRequirements client option instead.', 'yuuko#89');
// https://github.com/eritbh/yuuko/issues/90
exports.defaultPrefix = warningEmitter('Client#defaultPrefix is deprecated. Use Client#prefix instead.', 'yuuko#90');
