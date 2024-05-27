import { CommandInteraction } from 'discord.js';

export type Command = {
  name: string;
  allowList?: number[];
  execute(interaction: CommandInteraction): Promise<void>;
};
