import {EventListener} from '../EventListener';

export default new EventListener('interactionCreate', (interaction, {client}) => {
	client.processApplicationCommandResponse(interaction);
});
