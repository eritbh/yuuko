import * as Eris from 'eris';
export declare class SlashCommand {
    static COMMAND_TYPE: 1;
    name: string;
    description: string;
    options: Eris.ApplicationCommandOptions[];
    process: (interaction: Eris.CommandInteraction) => void;
    constructor(name: string, { description, options, }: {
        description: string;
        options?: Eris.ApplicationCommandOptions[];
    }, process: (interaction: Eris.CommandInteraction) => void);
    toJSON(): Eris.ChatInputApplicationCommandStructure;
}
