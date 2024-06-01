import { SlashCommandBuilder } from 'discord.js';

export const noah_slash_command = new SlashCommandBuilder()
  .setName('noah')
  .setDescription('The command for the lad.')
  .addSubcommand(request => request.setName('request').setDescription('Feed Noah'));
