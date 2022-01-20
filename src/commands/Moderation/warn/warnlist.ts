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
import warnSchema from "../../../database/mongo/schemas/warn";

export default {
  category: "Moderation",
  description: "lists all warns",
  names: "warn-list",
  expectedArgs: "<user>",
  expectedArgsTypes: ["USER"],
  permissions: ["SEND_MESSAGES"],
  slash: "both",
  testOnly: true,
  callback: async ({ member: staff, interaction, message, args, client }) => {
    let userId = args.shift()!;

    let user: User | undefined;

    if (message) {
      user = message.mentions.users.first();
    } else {
      user = interaction.options.getUser("user") as User;
    }

    if (!user) {
      userId = userId.replace(/[<@!>]/g, "");
      user = await client.users.fetch(userId);
    }

    userId = user.id;

    const warnings = await warnSchema.find({
      userId: user?.id,
    });

    let description = `Warnings for <@${user?.id}>:\n\n`;

    for (const warn of warnings) {
      description += `**MongoID ${warn._id}`;
      description += `**UserID:** ${warn.userId}\n`;
      description += `**Date:** ${warn.createdAt.toLocaleString()}\n`;
      description += `**Staff** <@${warn.staffId}>\n`;
      description += `**Reason** ${warn.reason}\n\n`;
    }

    const embed = new MessageEmbed()
      .setDescription(description)
      .setColor("BLUE");

    return embed;
  },
} as ICommand;
