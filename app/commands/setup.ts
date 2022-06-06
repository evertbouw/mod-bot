import { SlashCommandBuilder } from "@discordjs/builders";
import type { CommandInteraction } from "discord.js";

import { SETTINGS, setSettings, registerGuild } from "~/models/guilds.server";

export default new SlashCommandBuilder()
  .setName("setup")
  .setDescription("Set up necessities for using the bot")
  // TODO: update permissions so non-mods can never use it
  // maybe implement as "adder must init immediately"?
  // .setDefaultPermission(true);
  .addRoleOption((x) =>
    x
      .setName("moderator")
      .setDescription("The role that grants moderator permissions for a user")
      .setRequired(true),
  )
  .addChannelOption((x) =>
    x
      .setName("mod-log-channel")
      .setDescription("The channel where moderation reports will be sent")
      .setRequired(true),
  );

export const handler = async (interaction: CommandInteraction) => {
  try {
    if (!interaction.guild) throw new Error("Interaction has no guild");

    await registerGuild(interaction.guild);

    const role = interaction.options.getRole("moderator");
    const channel = interaction.options.getChannel("mod-log-channel");
    if (!role) throw new Error("Interaction has no role");
    if (!channel) throw new Error("Interaction has no channel");

    await setSettings(interaction.guild, {
      [SETTINGS.modLog]: channel.id,
      [SETTINGS.moderator]: role.id,
    });

    interaction.reply("Setup completed!");

    /*
  interaction.followUp({
  // tts?: boolean;
  // nonce?: string | number;
  // content?: string | null;
  // embeds?: (MessageEmbed | MessageEmbedOptions | APIEmbed)[];
  // components?: (MessageActionRow | (Required<BaseMessageComponentOptions> & MessageActionRowOptions))[];
  // allowedMentions?: MessageMentionOptions;
  // files?: (FileOptions | BufferResolvable | Stream | MessageAttachment)[];
  // attachments?: MessageAttachment[];

  // ephemeral?: boolean;
  // fetchReply?: boolean;
  // threadId?: Snowflake;
}
  });
*/
  } catch (e) {
    if (e instanceof Error) {
      interaction.reply(`Something broke:
\`\`\`
${e.toString()}
\`\`\`
`);
    }
  }
};