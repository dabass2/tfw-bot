import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { SlashCommandBuilder, SlashCommandSubcommandsOnlyBuilder } from 'discord.js';
import dotenv from 'dotenv';
import * as slashCommands from './commands/slash_builders';

dotenv.config({ path: '../.env' });

const botCommands: (SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder)[] = [
  slashCommands.glug_slash_command,
  slashCommands.noah_slash_command,
  slashCommands.ping_slash_command,
  slashCommands.rmeme_slash_command,
  slashCommands.tic_slash_command,
];

// Place your client and guild ids here

const clientId = '500122158039826433';
const guildId = '500122804520353799'; // dev
// const guildId = '110419059232780288'; // prod

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_BOT_TOKEN);

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
      body: botCommands.map(cmd => cmd.toJSON()),
    });

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();
