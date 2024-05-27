import { SlashCommandBuilder } from 'discord.js';

export const rmeme_slash_command = new SlashCommandBuilder()
  .setName('rmeme')
  .setDescription('Send, vote, upload, or delete memes')
  .addSubcommand(getSubCmd =>
    getSubCmd
      .setName('get')
      .setDescription('Select a specific meme to view and/or vote on.')
      .addNumberOption(id_opt =>
        id_opt.setName('id').setDescription('Select a specific meme to view and/or vote on.')
      )
  )
  .addSubcommand(upVtSubCmd =>
    upVtSubCmd
      .setName('up')
      .setDescription('Upvote a meme')
      .addNumberOption(id_opt => id_opt.setName('id').setDescription('ID of the meme'))
  )
  .addSubcommand(dwnVtSubCmd =>
    dwnVtSubCmd
      .setName('down')
      .setDescription('Downvote a meme')
      .addNumberOption(id_opt => id_opt.setName('id').setDescription('ID of the meme'))
  )
  .addSubcommand(delSubCmd =>
    delSubCmd
      .setName('delete')
      .setDescription('Delete a meme')
      .addNumberOption(id_opt => id_opt.setName('id').setDescription('ID of the meme'))
  )
  .addSubcommand(upldSubCmd =>
    upldSubCmd
      .setName('upload')
      .setDescription('Upload a new meme.')
      .addStringOption(url_opt =>
        url_opt
          .setName('url')
          .setDescription('The url of the post to be uploaded')
          .setRequired(true)
      )
  );
