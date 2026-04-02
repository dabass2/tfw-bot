import { SlashCommandBuilder } from 'discord.js';

export const bag_slash_command = new SlashCommandBuilder()
  .setName('bag')
  .setDescription('Check if there is a currently active bag alert');
