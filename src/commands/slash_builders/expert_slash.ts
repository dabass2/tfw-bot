import { SlashCommandBuilder } from 'discord.js';

export const expert_slash_command = new SlashCommandBuilder()
  .setName('expert')
  .setDescription("For when there's an expert in the chat");
