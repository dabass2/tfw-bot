const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder().setName("ping").setDescription("Pong!"),
  async execute(interaction) {
    if (interaction.member.user.id !== "122090401011073029") return;

    const msg = await interaction.reply({
      content: "Pinging...",
      fetchReply: true,
    });
    interaction.editReply(
      `Pinged in: ${
        (msg.createdTimestamp - interaction.createdTimestamp) / 1000
      } seconds`
    );
  },
};
