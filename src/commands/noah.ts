import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { Command } from '../types/common';

export class NoahCommand implements Command {
  public name = 'noah';

  public async execute(interaction: ChatInputCommandInteraction) {
    const arg = interaction.options.getString('request');

    const msgEmbed = new EmbedBuilder();

    if (arg === 'request') {
      const msg_embed = new EmbedBuilder()
        .setColor('#D2691E')
        .setDescription('A simple request...')
        .addFields(
          {
            name: 'Request:',
            value: "For Noah to please eat my big fat ass until he's full.",
          },
          { name: 'Complete Request By:', value: `Tonight at ${new Date()}` }
        )
        .setTimestamp(new Date());
      await interaction.reply({ embeds: [msg_embed] });
    } else {
      msgEmbed
        .addFields({
          name: "Noah's greatest creation",
          value: 'https://leinad.pw/noah/',
        })
        .setColor('#FFC0CB')
        .setTimestamp(new Date());
      await interaction.reply({ embeds: [msgEmbed] });
    }
  }
}
