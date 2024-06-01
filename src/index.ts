import { Client, Collection, GatewayIntentBits } from 'discord.js';
import dotenv from 'dotenv';
import * as rawCommands from './commands/index.js';
import { Command } from './types/common';

dotenv.config({ path: 'src/.env' });

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
  client.user.setActivity('Valorant (Wife Hunting)');
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  const command = commandMap.get(interaction.commandName);

  if (!command) {
    await interaction.reply({
      content: `Command "${interaction.commandName}" does not exist`,
      ephemeral: true,
    });
    return;
  }

  if (command.allowList?.length && !command.allowList.includes(interaction.user.id)) {
    await interaction.reply({
      content: 'You cannot use this command',
      ephemeral: true,
    });
    return;
  }

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
