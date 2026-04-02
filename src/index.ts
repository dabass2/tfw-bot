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
  new rawCommands.BagAlertCommand(),
  new rawCommands.ExpertCommand(),
  new rawCommands.PetCommand(),
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
    console.error('tfw error:', error);
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);
