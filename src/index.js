const fs = require("fs");
const {
  Client,
  GatewayIntentBits,
  Collection,
  EmbedBuilder,
} = require("discord.js");
require("dotenv").config({ path: "../.env" });

const client = new Client({
  intents: [
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
  ],
});

client.commands = new Collection();
const commandFiles = fs
  .readdirSync("../commands")
  .filter((file) => file.endsWith(".js"));

const commands = [];
for (const file of commandFiles) {
  const command = require(`../commands/${file}`);
  commands.push(command.data.name);
  client.commands.set(command.data.name, command);
}

client.on("ready", () => {
  console.log(`${client.user.username} is online`);
  client.user.setActivity("Genshin Impact (Shamefully)");
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    const cmdEmbed = new EmbedBuilder();
    await command.execute(interaction, cmdEmbed);
  } catch (error) {
    console.error(error);
    try {
      // there's likely a better way to do this, but I don't care enough to find it
      if (interaction.user.id === "122090401011073029") {
        await interaction.reply({
          content: `There was an error while executing this command:\n${error}`,
          ephemeral: true,
        });
      } else {
        await interaction.reply({
          content: "There was an error while executing this command.",
          ephemeral: true,
        });
      }
    } catch (_) {
      // if here that means the above interaction was already replied to so it fails, so instead send a follow up
      if (interaction.user.id === "122090401011073029") {
        await interaction.followUp({
          content: `There was an error while executing this command:\n${error}`,
          ephemeral: true,
        });
      } else {
        await interaction.followUp({
          content: "There was an error while executing this command.",
          ephemeral: true,
        });
      }
    }
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);
