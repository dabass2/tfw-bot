import { ChatInputCommandInteraction } from 'discord.js';
import { Command } from '../../types/common';

export class PingCommand implements Command {
  public name: 'ping';

  public async execute(interaction: ChatInputCommandInteraction) {
    if (interaction.member.user.id !== '122090401011073029') return;

    const msg = await interaction.reply({
      content: 'Pinging...',
      fetchReply: true,
    });
    interaction.editReply(
      `Pinged in: ${(msg.createdTimestamp - interaction.createdTimestamp) / 1000} seconds`
    );
  }
}
