import {emitWarning} from 'process';

function warningEmitter (warning, code) {
	let hasWarned = false;
	return () => {
		if (hasWarned) return;
		hasWarned = true;
		emitWarning(warning, 'DeprecationWarning', code);
	};
}

// https://github.com/eritbh/yuuko/issues/88
export const addCommandDir = warningEmitter('Client#addCommandDir is deprecated. Use Client#addDir instead.', 'yuuko#88');
export const addCommandFile = warningEmitter('Client#addCommandFile is deprecated. Use Client#addFile instead.', 'yuuko#88');
export const reloadCommands = warningEmitter('Client#reloadCommands is deprecated. Use Client#reloadFiles instead.', 'yuuko#88');

// https://github.com/eritbh/yuuko/issues/89
export const setGlobalRequirements = warningEmitter('Client#setGlobalRequirements is deprecated. Use the globalCommandRequirements client option instead.', 'yuuko#89');
export const ignoreGlobalRequirements = warningEmitter('The ignoreGlobalRequirements client option is deprecated. Pass no globalCommandRequirements client option instead.', 'yuuko#89');

// https://github.com/eritbh/yuuko/issues/90
export const defaultPrefix = warningEmitter('Client#edfaultPrefix is deprecated. Use Client#prefix instead.', 'yuuko#90');
