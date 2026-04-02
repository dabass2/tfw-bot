import { SlashCommandBuilder } from 'discord.js';

export const pet_slash_command = new SlashCommandBuilder()
  .setName('pet')
  .setDescription('The command for the pet.')
  .addStringOption(option =>
    option.setName('name').setDescription('The name of the pet you want to see').setRequired(false)
  );
