import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { Command } from '../../types/common';

export class GlugCommand implements Command {
  public name: 'glugglug';

  public async execute(interaction: ChatInputCommandInteraction) {
    let msgEmbed = new EmbedBuilder();
    if (interaction.user.id === '468421106219614208') {
      msgEmbed.setColor(0x800080).setImage('https://leinad.dev/images/crowDog.jpg');
      await interaction.reply({ embeds: [msgEmbed] });
    } else {
      await interaction.reply({
        content: 'You cannot use this command.',
        ephemeral: true,
      });
    }
  }
}
