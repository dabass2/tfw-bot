const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const fs = require("fs");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("tic")
    .setDescription("Inner circle best circle")
    .addSubcommandGroup((movies) =>
      movies
        .setName("movies")
        .setDescription("TIC movie list")
        .addSubcommand((list) =>
          list.setName("list").setDescription("Get list of requested movies")
        )
        .addSubcommand((add) =>
          add
            .setName("add")
            .setDescription("Add movie")
            .addStringOption((name) =>
              name
                .setName("name")
                .setDescription("The name of the movie")
                .setRequired(true)
            )
        )
        .addSubcommand((vote) =>
          vote
            .setName("vote")
            .setDescription("Vote to watch or not watch a movie")
            .addNumberOption((vote) =>
              vote
                .setName("score")
                .setDescription("Positive for yes, negative for no")
                .setRequired(true)
            )
            .addNumberOption((id) =>
              id
                .setName("id")
                .setDescription("The id of the movie to vote on")
                .setRequired(true)
            )
        )
        .addSubcommand((rm) =>
          rm
            .setName("rm")
            .setDescription("Remove a movie from the queue")
            .addNumberOption((id) =>
              id
                .setName("id")
                .setDescription("The id of the movie to remove")
                .setRequired(true)
            )
        )
    ),
  async execute(interaction) {
    const ticJson = JSON.parse(fs.readFileSync("../tic.json"));

    const sub_command = interaction.options.getSubcommand();

    const id = interaction.options.getNumber("id") ?? 1 - 1;
    const vote = interaction.options.getNumber("score");
    const movieName = interaction.options.getString("name");

    let embed = new EmbedBuilder();
    embed.setTimestamp(new Date());
    embed.setColor(0xb085d4);

    if (sub_command === "list") {
      embed.setDescription("**TIC Movie Queue**");
    } else if (sub_command === "add") {
      ticJson.movies.push({
        name: movieName,
        requestor: interaction.member.user.id,
        dateAdded: new Date(),
        score: 1,
      });

      fs.writeFileSync("../tic.json", JSON.stringify(ticJson));
      embed.setDescription(`"${movieName}" added to the queue`);
    } else if (sub_command === "rm") {
      if (id > 0 || id < ticJson.movies.length) {
        ticJson.movies
          ?.sort((a, b) => (a.score > b.score ? -1 : 1))
          .splice(id, 1);
        fs.writeFileSync("../tic.json", JSON.stringify(ticJson));
      }

      embed.setDescription("**Movie removed from the queue**");
    } else if (sub_command === "vote") {
      const movie = ticJson.movies
        ?.sort((a, b) => (a.score > b.score ? -1 : 1))
        .at(id);
      if (movie) {
        movie.score += vote > 0 ? 1 : -1;
      }

      fs.writeFileSync("../tic.json", JSON.stringify(ticJson));
      embed.setDescription("**Vote recorded**");
    } else {
      embed.setDescription("__what?__");
    }

    ticJson.movies
      .sort((a, b) => (a.score > b.score ? -1 : 1))
      .map((movie, idx) => {
        embed.addFields({
          name: "Movie Name",
          value: `[#${idx + 1}]: "**${movie.name}**" - Votes: **${
            movie.score
          }** (Requestor: <@${movie.requestor}>)`,
        });
      });

    await interaction.reply({
      embeds: [embed],
    });
  },
};
