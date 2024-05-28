import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { Command } from '../../types/common';

export class GlugCommand implements Command {
  public name = 'glugglug';
  public allowList?: string[] = ['468421106219614208'];

  public async execute(interaction: ChatInputCommandInteraction) {
    let msgEmbed = new EmbedBuilder();
    msgEmbed.setColor(0x800080).setImage('https://leinad.dev/images/crowDog.jpg');
    await interaction.reply({ embeds: [msgEmbed] });
  }
}
