const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("noah")
    .setDescription("The command for the lad.")
    .addStringOption((option) =>
      option.setName("request").setDescription('Type "request" to feed Noah.')
    ),
  async execute(interaction, msgEmbed) {
    const arg = interaction.options.getString("request");
    if (arg === "request") {
      const msg_embed = new EmbedBuilder()
        .setColor("#D2691E")
        .setDescription("A simple request...")
        .addFields(
          {
            name: "Request:",
            value: "For Noah to please eat my big fat ass until he's full.",
          },
          { name: "Complete Request By:", value: `Tonight at ${new Date()}` }
        )
        .setTimestamp(new Date());
      await interaction.reply({ embeds: [msg_embed] });
    } else {
      msgEmbed
        .addFields({
          name: "Noah's greatest creation",
          value: "https://leinad.pw/noah/",
        })
        .setColor("#FFC0CB")
        .setTimestamp(new Date());
      await interaction.reply({ embeds: [msgEmbed] });
    }
  },
};
