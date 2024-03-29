const { SlashCommandBuilder } = require("@discordjs/builders");
const {
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  ComponentType,
} = require("discord.js");

const RMEME_API_URL = "https://api.rmeme.me";

const SIXTY_SECONDS = 60000;
const FIFTEEN_SECONDS = 15000;

let replyInteraction;

async function getMeme(meme_id) {
  const api_response = await makeApiCall(
    meme_id ? `${RMEME_API_URL}/meme/${meme_id}` : `${RMEME_API_URL}/rmeme`,
    (method = "GET"),
    (body = undefined),
    (sendApiKey = !!meme_id)
  );

  if (!api_response) {
    await replyInteraction.reply({
      content: api_response.message,
    });
    return;
  }

  meme_id = api_response.meme_id;

  const desc = `Meme: #${meme_id} | Score: ${api_response.score}`;
  const url = api_response.url;

  const meme_embed = new EmbedBuilder()
    .setDescription(desc)
    .setImage(url)
    .setTimestamp(new Date());

  // Can't embed videos, so we just send it as a raw link so discord will embed for us
  const interaction_body =
    api_response.format === "video"
      ? { content: `${desc}\n${url}`, components: createVoteButtons() }
      : { embeds: [meme_embed], components: createVoteButtons() };

  const sentMessage = await replyInteraction.reply(interaction_body);

  const collector = sentMessage.createMessageComponentCollector({
    componentType: ComponentType.Button,
    time: SIXTY_SECONDS,
    idle: FIFTEEN_SECONDS,
  });

  let totalScore = 0;
  const upvoters = [];
  const downvoters = [];
  collector.on("collect", async (i) => {
    const VOTING_USER = i.user.id;

    const IS_UPVOTING = i.customId === "up";
    const HAS_UPVOTED = upvoters.includes(VOTING_USER);

    const IS_DOWNVOTING = i.customId === "down";
    const HAS_DOWNVOTED = downvoters.includes(VOTING_USER);

    if (IS_UPVOTING && !HAS_UPVOTED) {
      upvoters.push(VOTING_USER);
      totalScore += 1;
    } else if (IS_DOWNVOTING && !HAS_DOWNVOTED) {
      downvoters.push(downvoters);
      totalScore -= 1;
    } else if (IS_UPVOTING && HAS_DOWNVOTED) {
      downvoters = downvoters.filter((user) => user !== VOTING_USER);
      upvoters.push(VOTING_USER);
      totalScore += 2;
    } else if (IS_DOWNVOTING && HAS_UPVOTED) {
      upvoters = upvoters.filter((user) => user != VOTING_USER);
      downvoters.push(VOTING_USER);
      total -= 2;
    }

    await i.update({ components: createVoteButtons() });
  });

  collector.on("end", async () => {
    console.log("Collected score: " + totalScore);
    if (totalScore == 0) {
      voteMeme(meme_id, totalScore);
    }

    const updatedDesc = `Meme: #${api_response.meme_id} | ${
      !!totalScore !== 0 ? "Updated " : ""
    }Score: ${api_response.score + totalScore}`;

    const updated_embed = new EmbedBuilder()
      .setDescription(updatedDesc)
      .setImage(url)
      .setTimestamp(new Date());

    const interaction_body =
      api_response.format === "video"
        ? {
            content: `${updatedDesc}\n${url}`,
            components: [],
          }
        : {
            embeds: [updated_embed],
            components: [],
          };

    await replyInteraction.editReply(interaction_body);
  });
}

async function uploadMeme(upload_url) {
  console.log("Uploading", upload_url);
  if (!upload_url) return;

  const api_response = await makeApiCall(
    `${RMEME_API_URL}/meme`,
    (method = "POST"),
    (body = { url: upload_url }),
    (sendApiKey = true)
  );

  if (!api_response) {
    await replyInteraction.reply({
      content: api_response.message,
    });
    return;
  }

  const desc = `Uploaded Meme: #${api_response.meme_id}`;
  const url = api_response.url;

  const meme_embed = new EmbedBuilder()
    .setDescription(desc)
    .setImage(url)
    .setTimestamp(new Date());

  // Can't embed videos, so we just send it as a raw link so discord will embed for us
  const interaction_body =
    api_response.format === "video"
      ? { content: `${desc}\n${url}`, ephemeral: true }
      : { embeds: [meme_embed], ephemeral: true };

  await replyInteraction.reply(interaction_body);
}

async function voteMeme(meme_id, inpt_votes) {
  console.log(`Voting on meme ${meme_id} with votes ${inpt_votes}`);
  if (!meme_id) return;

  const api_response = await makeApiCall(
    `${RMEME_API_URL}/meme/${meme_id}`,
    (method = "PUT"),
    (body = { votes: inpt_votes }),
    (sendApiKey = true)
  );

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

async function deleteMeme(meme_id) {
  console.log("Deleting meme", meme_id);

  if (!meme_id) return;

  const api_response = await makeApiCall(
    `${RMEME_API_URL}/meme/${meme_id}`,
    (method = "DELETE"),
    (body = undefined),
    (sendApiKey = true)
  );

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

module.exports = {
  data: new SlashCommandBuilder()
    .setName("rmeme")
    .setDescription("Send, vote, upload, or delete memes")
    .addSubcommand((getSubCmd) =>
      getSubCmd
        .setName("get")
        .setDescription("Select a specific meme to view and/or vote on.")
        .addNumberOption((id_opt) =>
          id_opt
            .setName("id")
            .setDescription("Select a specific meme to view and/or vote on.")
        )
    )
    .addSubcommand((upVtSubCmd) =>
      upVtSubCmd
        .setName("up")
        .setDescription("Upvote a meme")
        .addNumberOption((id_opt) =>
          id_opt.setName("id").setDescription("ID of the meme")
        )
    )
    .addSubcommand((dwnVtSubCmd) =>
      dwnVtSubCmd
        .setName("down")
        .setDescription("Downvote a meme")
        .addNumberOption((id_opt) =>
          id_opt.setName("id").setDescription("ID of the meme")
        )
    )
    .addSubcommand((delSubCmd) =>
      delSubCmd
        .setName("delete")
        .setDescription("Delete a meme")
        .addNumberOption((id_opt) =>
          id_opt.setName("id").setDescription("ID of the meme")
        )
    )
    .addSubcommand((upldSubCmd) =>
      upldSubCmd
        .setName("upload")
        .setDescription("Upload a new meme.")
        .addStringOption((url_opt) =>
          url_opt
            .setName("url")
            .setDescription("The url of the post to be uploaded")
            .setRequired(true)
        )
    ),
  async execute(interaction) {
    replyInteraction = interaction;

    const sub_command = interaction.options.getSubcommand();

    const meme_id = interaction.options.getNumber("id");
    const upload_url = interaction.options.getString("url");

    switch (sub_command) {
      case "upload":
        return uploadMeme(upload_url);
      case "up":
        return voteMeme(meme_id, 1);
      case "down":
        return voteMeme(meme_id, -1);
      case "delete":
        return deleteMeme(meme_id);
      default:
        return getMeme(meme_id);
    }
  },
};

async function makeApiCall(
  url,
  method = "GET",
  body = undefined,
  useApiKey = false
) {
  const API_KEY_HDR = useApiKey
    ? { "x-api-key": process.env.RMEME_API_KEY }
    : {};

  try {
    return (
      await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          ...API_KEY_HDR,
        },
        body: JSON.stringify(body),
        method: method,
      })
    ).json();
  } catch (e) {
    console.error("Error making rmeme api call: ", e);
    return;
  }
}

function createVoteButtons(disabled = false) {
  return [
    new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("up")
        .setStyle(ButtonStyle.Success)
        .setEmoji("✔️")
        .setDisabled(disabled),
      new ButtonBuilder()
        .setCustomId("down")
        .setStyle(ButtonStyle.Danger)
        .setEmoji("✖️")
        .setDisabled(disabled)
    ),
  ];
}
