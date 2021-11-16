import * as Eris from 'eris';

export class SlashCommand {
	static COMMAND_TYPE = Eris.Constants.ApplicationCommandTypes.CHAT_INPUT;

	name: string;

	description: string;

	options: Eris.ApplicationCommandOptions[];

	process: (interaction: Eris.CommandInteraction) => void;

	constructor (name: string, {
		description,
		options = [],
	}: {
		description: string;
		options?: Eris.ApplicationCommandOptions[];
	}, process: (interaction: Eris.CommandInteraction) => void) {
		this.name = name;
		this.description = description;
		this.options = options;
		this.process = process;
	}

	toJSON (): Eris.ChatInputApplicationCommandStructure {
		return {
			name: this.name,
			type: Eris.Constants.ApplicationCommandTypes.CHAT_INPUT,
			description: this.description,
			options: this.options,
		};
	}
}
