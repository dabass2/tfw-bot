import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { Command } from '../types/common';

const image_base_url = 'https://leinad.dev/images/';

const pets = {
  tara: [
    'tara/tara_.mp4',
    'tara/tara_blur.jpg',
    'tara/tara_deadhorse.jpg',
    'tara/tara_hands.mp4',
    'tara/tara_help.jpg',
    'tara/tara_line.jpg',
    'tara/tara_noneck.jpg',
    'tara/tara_scared.jpg',
    'tara/tara_stogie.mp4',
    'tara/tara_tongue.jpg',
    'tara/tara_applewatch.jpg',
    'tara/tara_cold.jpg',
    'tara/tara_demon.jpg',
    'tara/tara_happy.jpg',
    'tara/tara_horse.jpg',
    'tara/tara_look.jpg',
    'tara/tara_plank.jpg',
    'tara/tara_sleepy.jpg',
    'tara/tara_sun.jpg',
    'tara/tara_truck.jpg',
    'tara/tara_blep.jpg',
    'tara/tara_cute.jpg',
    'tara/tara_ears.jpg',
    'tara/tara_headless.jpg',
    'tara/tara_king.jpg',
    'tara/tara_mischievous.jpg',
    'tara/tara_puppy.jpg',
    'tara/tara_sorry.jpg',
    'tara/tara_terrified.jpg',
    'tara/tara_yard.jpg',
  ],
  edward: [
    'edward/edward_chair.jpg',
    'edward/edward_christmas.jpg',
    'edward/edward_flop.jpg',
    'edward/edward_king.jpg',
    'edward/edward_lounge.jpg',
    'edward/edward_pensive.jpg',
    'edward/edward_red.jpg',
    'edward/edward_sit.jpg',
    'edward/edward_slim.jpg',
    'edward/edward_stoic.jpg',
    'edward/edward_cheeze.jpg',
    'edward/edward_curl.jpg',
    'edward/edward_grump.jpg',
    'edward/edward_lay.jpg',
    'edward/edward_majestic.jpg',
    'edward/edward_present.jpg',
    'edward/edward_regal.jpg',
    'edward/edward_sleep.jpg',
    'edward/edward_sniffy.jpg',
    'edward/edward_trapped.jpg',
    'edward/edward_chill.jpg',
    'edward/edward_despair.jpg',
    'edward/edward_grumpy.jpg',
    'edward/edward_leg.jpg',
    'edward/edward_nap.jpg',
    'edward/edward_railing.jpg',
    'edward/edward_secretimage.jpg',
    'edward/edward_slept.jpg',
    'edward/edward_sprawl.jpg',
    'edward/edward_window.jpg',
  ],
};

export class PetCommand implements Command {
  public name = 'pet';

  public async execute(interaction: ChatInputCommandInteraction) {
    const specific_pet = interaction.options.getString('name')?.toLowerCase();

    if (specific_pet && !Object.keys(pets).includes(specific_pet)) {
      await interaction.reply({
        content: `${specific_pet} hasn't been registered yet ☹️. Currently valid pets are: ${Object.keys(pets).join(', ')}`,
        ephemeral: true,
      });
      return;
    }

    let pet_images: string[] = [];
    if (specific_pet) {
      pet_images = pets[specific_pet as keyof typeof pets];
    } else {
      pet_images = Object.values(pets).flat();
    }

    const msgEmbed = new EmbedBuilder();
    const random_pet_image = pet_images[Math.floor(Math.random() * pet_images.length)];
    const image_url = `${image_base_url}${random_pet_image}`;
    const desc = specific_pet
      ? `Here's a picture of ${specific_pet}!`
      : "Here's a picture of one of a pet!";

    // Can't embed videos, so we just send it as a raw link so discord will embed for us
    const interaction_body = random_pet_image.endsWith('.mp4')
      ? { content: `${desc}\n${image_url}` }
      : { embeds: [msgEmbed] };

    msgEmbed.setColor(0x00ff00).setImage(image_url);
    await interaction.reply(interaction_body);
  }
}
