import { Client, Collection, GatewayIntentBits } from 'discord.js';
import dotenv from 'dotenv';
import { Command } from '../types/common';
import * as rawCommands from './commands';

dotenv.config({ path: '../.env' });

const client = new Client({
  intents: [
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
  ],
});

const commandMap = new Collection<string, Command>();
const botCommands: Command[] = [
  new rawCommands.GlugCommand(),
  new rawCommands.NoahCommand(),
  new rawCommands.PingCommand(),
  new rawCommands.RmemeCommand(),
  new rawCommands.TicCommand(),
];

botCommands.forEach(cmd => {
  commandMap.set(cmd.name, cmd);
});

client.on('ready', () => {
  console.log(`${client.user.username} is online`);
  client.user.setActivity('Genshin Impact (Shamefully)');
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  const command = commandMap.get(interaction.commandName);

  if (!command) return;

  if (command.allowList && !command.allowList.includes(Number(interaction.user.id))) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    try {
      // there's likely a better way to do this, but I don't care enough to find it
      if (interaction.user.id === '122090401011073029') {
        await interaction.reply({
          content: `There was an error while executing this command:\n${error}`,
          ephemeral: true,
        });
      } else {
        await interaction.reply({
          content: 'There was an error while executing this command.',
          ephemeral: true,
        });
      }
    } catch (_) {
      // if here that means the above interaction was already replied to so it fails, so instead send a follow up
      if (interaction.user.id === '122090401011073029') {
        await interaction.followUp({
          content: `There was an error while executing this command:\n${error}`,
          ephemeral: true,
        });
      } else {
        await interaction.followUp({
          content: 'There was an error while executing this command.',
          ephemeral: true,
        });
      }
    }
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);
