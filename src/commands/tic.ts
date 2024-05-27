import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import fs from 'fs';
import { Command } from '../../types/common';
import { TicJson } from '../../types/tic';

export class TicCommand implements Command {
  public name: 'tic';

  public async execute(interaction: ChatInputCommandInteraction) {
    const jsonString = String(fs.readFileSync('../tic.json'));
    const ticJson = JSON.parse(jsonString) as TicJson;

    const sub_command = interaction.options.getSubcommand();

    const id = interaction.options.getNumber('id') - 1;
    const vote = interaction.options.getNumber('score');
    const movieName = interaction.options.getString('name');

    let embed = new EmbedBuilder();
    embed.setTimestamp(new Date());
    embed.setColor(0xb085d4);

    let isEphemeral = true;
    if (sub_command === 'list') {
      isEphemeral = false;
      embed.setDescription('**TIC Movie Queue**');
    } else if (sub_command === 'add') {
      if ((ticJson.movies.length ?? 0) >= 25) {
        embed.setDescription('**Movie queue is full**');
      } else {
        ticJson.movies.push({
          name: movieName,
          requestor: interaction.member.user.id,
          dateAdded: new Date(),
          score: 1,
        });

        fs.writeFileSync('../tic.json', JSON.stringify(ticJson));
        embed.setDescription(`"${movieName}" added to the queue`);
      }
    } else if (sub_command === 'rm') {
      if (id > 0 || id < ticJson.movies.length) {
        ticJson.movies?.sort((a, b) => (a.score > b.score ? -1 : 1)).splice(id, 1);
        fs.writeFileSync('../tic.json', JSON.stringify(ticJson));
      }

      embed.setDescription('**Movie removed from the queue**');
    } else if (sub_command === 'vote') {
      const movie = ticJson.movies?.sort((a, b) => (a.score > b.score ? -1 : 1)).at(id);
      if (movie) {
        movie.score += vote > 0 ? 1 : -1;
      }

      fs.writeFileSync('../tic.json', JSON.stringify(ticJson));
      embed.setDescription('**Vote recorded**');
    } else {
      embed.setDescription('__what?__');
    }

    ticJson.movies
      .sort((a, b) => (a.score > b.score ? -1 : 1))
      .map((movie, idx) => {
        embed.addFields({
          name: 'Movie Name',
          value: `[#${idx + 1}]: "**${movie.name}**" - Votes: **${
            movie.score
          }** (Requestor: <@${movie.requestor}>)`,
        });
      });

    await interaction.reply({
      embeds: [embed],
      ephemeral: isEphemeral,
    });
  }
}
