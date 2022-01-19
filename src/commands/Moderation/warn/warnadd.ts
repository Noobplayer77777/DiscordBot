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

import { MessageEmbed, User } from "discord.js";
import { ICommand } from "wokcommands";
import schemas from "../../../database/mongo/schemas/warn";

export default {
  category: "Moderation",
  names: 'warnadd',
  description: `Warns a user`,
  expectedArgs: "<user> <reason>",
  expectedArgsTypes: ["USER", "STRING"],
  permissions: ["KICK_MEMBERS"],
  slash: 'both',
  testOnly: true,
  callback: async ({
    member: staff,
    interaction,
    message,
    args,
    client,
  }) => {
    let userId = args.shift()!;
    let reason = args.join(" ");

    let user: User | undefined;

    if (message) {
      user = message.mentions.users.first();
    } else {
      user = interaction.options.getUser("user") as User;
    }

    if (!user) {
      userId = userId.replace(/[<@!>]/g, "");
      user = await client.users.fetch(userId);

      if (!user) return "That User doesnt exist with the id of " + userId;
    }

    userId = user.id;

    const warning = await schemas.create({
      userId: user?.id,
      reason,
      staffId: staff.id,
    });
    let embed = new MessageEmbed()
      .setTitle("Warning")
      .setDescription(`<@${user.id}> has been warned for ${reason}`)
      .setColor("AQUA")
      .setTimestamp();
    let embel = new MessageEmbed()
      .setTitle("Warning")
      .setDescription(`You been warned for ${reason}\n By <@${staff.id}>`)
      .setColor("RED")
      .setTimestamp();
      try { 
      await  user.send({ embeds: [embel] })
      } catch (e) {
        return;
      }

    
    // return {
    //   custom: true,
    //   content: { embeds: [embed] },
    //   allowedMentions: {
    //     users: [],
    //   },
    // };
  },
} as ICommand;
