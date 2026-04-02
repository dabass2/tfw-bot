import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { Command } from '../types/common';

type BagAlertResponse = {
  active_alert: boolean;
};

const bag_alert_api = 'https://alert.leinad.dev';

export class BagAlertCommand implements Command {
  public name = 'bag';

  public async execute(interaction: ChatInputCommandInteraction) {
    let embed_msg: string = 'No currently active Major Bag Alert';
    let embed_img: null | string = null;

    const alert_res = await fetch(bag_alert_api);
    const current_alert: BagAlertResponse = (await alert_res.json()) as BagAlertResponse;

    if (current_alert.active_alert) {
      embed_msg =
        '🚨 💰 [THERE IS CURRENTLY AN ACTIVE MAJOR BAG ALERT!!!!!!!](https://www.youtube.com/watch?v=sAJ_n8iVn6E) 🚨 💰';
      embed_img = 'https://c.tenor.com/V37wFJhl8yEAAAAC/rebranding-rebrand1ng.gif';
    }

    const msgEmbed = new EmbedBuilder();
    msgEmbed
      .setTitle('BAG ALERT')
      .setColor('#a46ee6')
      .setDescription(embed_msg)
      .setImage(embed_img)
      .setTimestamp(new Date());
    interaction.reply({ embeds: [msgEmbed] });
  }
}
