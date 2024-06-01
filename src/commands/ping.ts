import { ChatInputCommandInteraction } from 'discord.js';
import { Command } from '../types/common';

export class PingCommand implements Command {
  public name = 'ping';
  public allowList?: string[] = ['122090401011073029'];

  public async execute(interaction: ChatInputCommandInteraction) {
    const msg = await interaction.reply({
      content: 'Pinging...',
      fetchReply: true,
    });
    await interaction.editReply(
      `Pinged in: ${(msg.createdTimestamp - interaction.createdTimestamp) / 1000} seconds`
    );
  }
}
