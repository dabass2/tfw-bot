import { SlashCommandBuilder } from 'discord.js';

export const tic_slash_command = new SlashCommandBuilder()
  .setName('tic')
  .setDescription('Inner circle best circle')
  .addSubcommandGroup(movies =>
    movies
      .setName('movies')
      .setDescription('TIC movie list')
      .addSubcommand(list => list.setName('list').setDescription('Get list of requested movies'))
      .addSubcommand(add =>
        add
          .setName('add')
          .setDescription('Add movie')
          .addStringOption(name =>
            name.setName('name').setDescription('The name of the movie').setRequired(true)
          )
      )
      .addSubcommand(vote =>
        vote
          .setName('vote')
          .setDescription('Vote to watch or not watch a movie')
          .addNumberOption(vote =>
            vote
              .setName('score')
              .setDescription('Positive for yes, negative for no')
              .setRequired(true)
          )
          .addNumberOption(id =>
            id.setName('id').setDescription('The id of the movie to vote on').setRequired(true)
          )
      )
      .addSubcommand(rm =>
        rm
          .setName('rm')
          .setDescription('Remove a movie from the queue')
          .addNumberOption(id =>
            id.setName('id').setDescription('The id of the movie to remove').setRequired(true)
          )
      )
  );
