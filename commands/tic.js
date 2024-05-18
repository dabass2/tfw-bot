const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const fs = require("fs");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("tic")
    .setDescription("Inner circle best circle")
    .addSubcommandGroup(movies =>
        movies
            .setName("movies")
            .setDescription("TIC movie list")
            .addSubcommand(list => 
                list
                    .setName("list")
                    .setDescription("Get list of requested movies")
            )
            .addSubcommand(add => 
                add
                    .setName("add")
                    .setDescription("Add movie")
                    .addStringOption(name =>
                        name
                            .setName("name")
                            .setDescription("The name of the movie")
                            .setRequired(true)
                    )
            )
            .addSubcommand(vote =>
                vote
                    .setName("vote")
                    .setDescription("Vote to watch or not watch a movie")
                    .addNumberOption(vote =>
                        vote
                            .setName("score")
                            .setDescription("Positive for yes, negative for no")
                    )
                    .addNumberOption(id =>
                        id
                            .setName("id")
                            .setDescription("The id of the movie to vote on")
                    )
            )
            .addSubcommand(rm =>
                rm
                    .setName("rm")
                    .setDescription("Remove a movie from the queue")
                    .addNumberOption(id =>
                        id
                            .setName("id")
                            .setDescription("The id of the movie to remove")
                    )
            )
    ),
  async execute(interaction) {
    const ticJson = JSON.parse(fs.readFileSync("../tic.json"));
    console.log(ticJson);

    const sub_command = interaction.options.getSubcommand();

    const id = interaction.options.getNumber("id");
    const vote = interaction.options.getNumber("score");
    const movieName = interaction.options.getString("name")

    let embed;
    if (sub_command === "list") {
        embed = new EmbedBuilder()
            .setDescription("TIC Movie Queue")
            .setTimestamp(new Date());
        ticJson.movies.sort((a,b) => a.score > b.score ? -1 : 1).map(movie => {
            embed.addFields({
                name: "Movie Name",
                value: `${movie.id}: ${movie.name} - Votes: ${movie.score}`
            });
        })
    } else if (sub_command === "add") {
        ticJson.movies.push({
            id: ticJson.movies?.length ?? 0,
            name: movieName,
            requestor: interaction.member.user.id,
            dateAdded: new Date(),
            score: 1
        })
        fs.writeFileSync("../tic.json", JSON.stringify(ticJson));
        embed = new EmbedBuilder()
            .setDescription("TIC Movie Queue")
            .setDescription(`"${movieName}" added to the queue`)
            .setTimestamp(new Date());
    } else if (sub_command === "rm") {
        const oldMovie = ticJson.movies?.splice(id, 1)
        fs.writeFileSync("../tic.json", JSON.stringify(ticJson));
        embed = new EmbedBuilder()
            .setDescription("TIC Movie Queue")
            .setDescription(`${oldMovie?.name ?? "Movie"} removed from the queue`)
            .setTimestamp(new Date());
    } else if (sub_command === "vote") {
        const movie = ticJson.movies?.at(id);
        if (movie) {
            movie.score += vote > 0 ? 1 : -1
        }
        fs.writeFileSync("../tic.json", JSON.stringify(ticJson));
        embed = new EmbedBuilder()
            .setDescription("TIC Movie Queue")
            .setDescription("Vote recorded")
            .setTimestamp(new Date());
    } else {
        embed = new EmbedBuilder()
            .setDescription("what?")
            .setTimestamp(new Date());
    }

    await interaction.reply({
      embeds: [embed]
    });
  },
};
