// Copyright 2022 Northern Star
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { MessageEmbed } from "discord.js";
import { ICommand } from "wokcommands";
import { lavalink } from "../../main";

export default {
  description: "Shows the full queue",
  aliases: ['q'],
  category: "Music",
  testOnly: true,
  slash: "both",
  expectedArgs: `[Page Number]`,
  expectedArgsTypes: ["NUMBER"],
  callback: async ({ member, interaction, args }) => {
    const player = lavalink.get(member.guild.id);
    if (!player) {
      return "There is no player.";
    }

    if (interaction) {
      interaction.deferReply();
    }

    const queue = player.queue;
    const embed = new MessageEmbed().setAuthor({
      name: `Queue for this player`,
    });

    const multiple = 10;
    const page = args.length && Number(args[0]) ? Number(args[0]) : 1;

    const end = page * multiple;
    const start = end - multiple;

    const tracks = queue.slice(start, end);

    if (queue.current) {
      embed.addField(
        "Current",
        `[${queue.current.title}](${queue.current.uri})`
      );
    }

    if (!tracks.length) {
      embed.setDescription(
        `No Tracks in ${page > 1 ? `page ${page}` : "the queue"}`
      );
    } else {
      embed.setDescription(
        tracks
          .map((track, i) => `${start + ++i} - [${track.title}](${track.uri})`)
          .join("\n")
      );
    }

    const maxPages = Math.ceil(queue.length / multiple);

    embed.setFooter(`Page ${page > maxPages ? maxPages : page} of ${maxPages}`);

    if (interaction) {
      interaction.followUp({ embeds: [embed] });
    } else {
      return {
        custom: true,
        embeds: [embed],
      };
    }
  },
} as ICommand;
