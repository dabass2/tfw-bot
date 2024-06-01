import { CommandInteraction } from 'discord.js';

export type Command = {
  name: string;
  allowList?: string[];
  execute(interaction: CommandInteraction): Promise<void>;
};
