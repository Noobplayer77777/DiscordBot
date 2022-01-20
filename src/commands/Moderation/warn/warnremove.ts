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

import { ICommand } from "wokcommands";
import { MessageEmbed, TextChannel } from "discord.js";
import schemas from "../../../database/mongo/schemas/warn";

export default {
  category: "Moderation",
  description: "Lists all the warns of the user",
  expectedArgs: "<userid>",
  expectedArgsTypes: ["STRING"],
  slash: "both",
  permissions: ["KICK_MEMBERS"],
  callback: async ({ member: staff, args, interaction, message, client }) => {
    let user: String | undefined;

    if (message) {
      user = args.shift()!;
    } else {
      user = interaction.options.getString("userid") as String;
    }

    const warning = await schemas.findByIdAndDelete(user);
    const users = await await client.users.fetch(`${user}`);
    let embed2 = new MessageEmbed()
      .setTitle("Moderation Action")
      .setDescription(
        ` Type : Warn Remove \n Victim : <@${user}> \n Staff: <@${staff.id}> \n Duration: Permenant`
      )
      .setColor("GREEN")
      .setAuthor({
        name: staff.user.username,
        iconURL: staff.displayAvatarURL(),
      })
      .setTimestamp()
      .setThumbnail(users.displayAvatarURL());
    const channels = (await client.channels.fetch(
      "933582319187538001"
    )) as TextChannel;
    channels.send({ embeds: [embed2] });

    return {
      custom: true,
      content: `Removed warning ${warning.id} from <@${user}>`,
      allowedMentions: {
        users: [],
      },
    };
  },
} as ICommand;
