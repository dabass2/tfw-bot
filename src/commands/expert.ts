import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { Command } from '../types/common';

export class ExpertCommand implements Command {
  public name = 'expert';

  public async execute(interaction: ChatInputCommandInteraction) {
    let msgEmbed = new EmbedBuilder();
    msgEmbed.setColor(0xffff).setImage('https://leinad.dev/images/expert.jpg');
    await interaction.reply({ embeds: [msgEmbed] });
  }
}
