import { Command } from '../types/common';

import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  ComponentType,
  EmbedBuilder,
} from 'discord.js';
import { ApiFnArgs, MemeApiResponse } from '../types/rmeme';

const RMEME_API_URL = 'https://api.rmeme.me';

const TWO_MINUTES = 120000;
const SIXTY_SECONDS = 60000;

async function getMeme(replyInteraction: ChatInputCommandInteraction, meme_id: number) {
  const fn_args: ApiFnArgs = {
    url: meme_id ? `${RMEME_API_URL}/meme/${meme_id}` : `${RMEME_API_URL}/rmeme`,
    method: 'GET',
    useApiKey: !!meme_id,
  };

  const api_response = await makeApiCall(fn_args);

  if (!api_response) {
    await replyInteraction.reply({
      content: api_response.message,
    });
    return;
  }

  meme_id = api_response.meme_id;

  const desc = `Meme: #${meme_id} | Score: ${api_response.score}`;
  const url = api_response.url;

  const meme_embed = new EmbedBuilder().setDescription(desc).setImage(url).setTimestamp(new Date());

  // Can't embed videos, so we just send it as a raw link so discord will embed for us
  const interaction_body =
    api_response.format === 'video'
      ? { content: `${desc}\n${url}`, components: createVoteButtons() }
      : { embeds: [meme_embed], components: createVoteButtons() };

  const sentMessage = await replyInteraction.reply(interaction_body);

  const collector = sentMessage.createMessageComponentCollector({
    componentType: ComponentType.Button,
    time: TWO_MINUTES,
    idle: SIXTY_SECONDS,
  });

  let totalScore = 0;
  let upvoters: string[] = [];
  let downvoters: string[] = [];
  collector.on('collect', async i => {
    const VOTING_USER = i.user.id;

    const IS_UPVOTING = i.customId === 'up';
    const HAS_UPVOTED = upvoters.includes(VOTING_USER);

    const IS_DOWNVOTING = i.customId === 'down';
    const HAS_DOWNVOTED = downvoters.includes(VOTING_USER);

    if (IS_UPVOTING && !HAS_UPVOTED) {
      upvoters.push(VOTING_USER);
      totalScore += 1;
    } else if (IS_DOWNVOTING && !HAS_DOWNVOTED) {
      downvoters.push(VOTING_USER);
      totalScore -= 1;
    } else if (IS_UPVOTING && HAS_DOWNVOTED) {
      downvoters = downvoters.filter(user => user !== VOTING_USER);
      upvoters.push(VOTING_USER);
      totalScore += 2;
    } else if (IS_DOWNVOTING && HAS_UPVOTED) {
      upvoters = upvoters.filter(user => user != VOTING_USER);
      downvoters.push(VOTING_USER);
      totalScore -= 2;
    }

    await i.update({ components: createVoteButtons() });
  });

  collector.on('end', async () => {
    console.log('Collected score: ' + totalScore);
    if (totalScore == 0) {
      voteMeme(replyInteraction, meme_id, totalScore);
    }

    const updatedDesc = `Meme: #${api_response.meme_id} | ${
      totalScore !== 0 ? 'Updated ' : ''
    }Score: ${api_response.score + totalScore}`;

    const updated_embed = new EmbedBuilder()
      .setDescription(updatedDesc)
      .setImage(url)
      .setTimestamp(new Date());

    const interaction_body =
      api_response.format === 'video'
        ? {
            content: `${updatedDesc}\n${url}`,
            components: [] as ActionRowBuilder<ButtonBuilder>[],
          }
        : {
            embeds: [updated_embed],
            components: [] as ActionRowBuilder<ButtonBuilder>[],
          };

    await replyInteraction.editReply(interaction_body);
  });
}

async function uploadMeme(replyInteraction: ChatInputCommandInteraction, upload_url: string) {
  console.log('Uploading', upload_url);
  if (!upload_url) return;

  const fn_args: ApiFnArgs = {
    url: `${RMEME_API_URL}/meme`,
    method: 'POST',
    body: { url: upload_url },
    useApiKey: true,
  };

  const api_response = await makeApiCall(fn_args);

  if (!api_response) {
    await replyInteraction.reply({
      content: api_response.message,
    });
    return;
  }

  const desc = `Uploaded Meme: #${api_response.meme_id}`;
  const url = api_response.url;

  const meme_embed = new EmbedBuilder().setDescription(desc).setImage(url).setTimestamp(new Date());

  // Can't embed videos, so we just send it as a raw link so discord will embed for us
  const interaction_body =
    api_response.format === 'video'
      ? { content: `${desc}\n${url}`, ephemeral: true }
      : { embeds: [meme_embed], ephemeral: true };

  await replyInteraction.reply(interaction_body);
}

async function voteMeme(
  replyInteraction: ChatInputCommandInteraction,
  meme_id: number,
  inpt_votes: number
) {
  console.log(`Voting on meme ${meme_id} with votes ${inpt_votes}`);
  if (!meme_id) return;

  const fn_args: ApiFnArgs = {
    url: `${RMEME_API_URL}/meme/${meme_id}`,
    method: 'PUT',
    body: { votes: inpt_votes },
    useApiKey: true,
  };

  const api_response = await makeApiCall(fn_args);

  console.log(api_response);
  if (!api_response) {
    await replyInteraction.reply({
      content: api_response.message,
    });
    return;
  }

  const meme_embed = new EmbedBuilder()
    .setDescription(`${api_response.message} | New Score ${api_response.score}`)
    .setTimestamp(new Date());

  await replyInteraction.reply({ embeds: [meme_embed], ephemeral: true });
}

async function deleteMeme(replyInteraction: ChatInputCommandInteraction, meme_id: number) {
  console.log('Deleting meme', meme_id);

  if (!meme_id) return;

  const fn_args: ApiFnArgs = {
    url: `${RMEME_API_URL}/meme/${meme_id}`,
    method: 'DELETE',
    body: undefined,
    useApiKey: true,
  };

  const api_response = await makeApiCall(fn_args);

  console.log(api_response);
  if (!api_response) {
    await replyInteraction.reply({
      content: api_response.message,
    });
    return;
  }

  const meme_embed = new EmbedBuilder()
    .setDescription(api_response.message)
    .setTimestamp(new Date());

  await replyInteraction.reply({ embeds: [meme_embed], ephemeral: true });
}

export class RmemeCommand implements Command {
  public name = 'rmeme';

  public async execute(interaction: ChatInputCommandInteraction) {
    const sub_command = interaction.options.getSubcommand();

    const meme_id = interaction.options.getNumber('id');
    const upload_url = interaction.options.getString('url');

    switch (sub_command) {
      case 'upload':
        return uploadMeme(interaction, upload_url);
      case 'up':
        return voteMeme(interaction, meme_id, 1);
      case 'down':
        return voteMeme(interaction, meme_id, -1);
      case 'delete':
        return deleteMeme(interaction, meme_id);
      default:
        return getMeme(interaction, meme_id);
    }
  }
}

async function makeApiCall({ url, method, body, useApiKey }: ApiFnArgs): Promise<MemeApiResponse> {
  const API_KEY_HDR = useApiKey ? ({ 'x-api-key': process.env.RMEME_API_KEY } as const) : {};

  try {
    return (
      await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...API_KEY_HDR,
        },
        body: JSON.stringify(body ?? undefined),
        method: method ?? 'GET',
      })
    ).json() as Promise<MemeApiResponse>;
  } catch (e) {
    console.error('Error making rmeme api call: ', e);
    return;
  }
}

function createVoteButtons(disabled = false): ActionRowBuilder<ButtonBuilder>[] {
  const buttons: ButtonBuilder[] = [
    new ButtonBuilder()
      .setCustomId('up')
      .setStyle(ButtonStyle.Success)
      .setEmoji('✔️')
      .setDisabled(disabled),
    new ButtonBuilder()
      .setCustomId('down')
      .setStyle(ButtonStyle.Danger)
      .setEmoji('✖️')
      .setDisabled(disabled),
  ];

  return [new ActionRowBuilder().addComponents(buttons)] as ActionRowBuilder<ButtonBuilder>[];
}
