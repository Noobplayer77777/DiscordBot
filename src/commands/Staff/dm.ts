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

export default {
  category: "Staff Utility",
  description: "Dms A guild member",
  aliases: ["pm"],
  expectedArgs: "<user> <message>",
  expectedArgsTypes: ["USER", "STRING"],
  slash: "both",
  testOnly: true,
  callback: async ({ message, interaction, args, client, member }) => {
    let users = args.shift()!;
    const messages = args.join(" ");

    let user: User | undefined;

    if (message) {
      user = message.mentions.users.first();
    } else {
      user = interaction.options.getUser("user") as User;
    }

    if (!user) {
      users = users.replace(/[<@!>]/g, "");
      user = await client.users.fetch(users);

      if (!user) {
        return "The user doesnt exist";
      }
    }

    users = user.id;
    let embed;
    if (message) {
      let embed = new MessageEmbed()
        .setTitle(`There is a message from staff of CMC`)
        .setAuthor({ name: message.author.username })
        .setDescription(`Message \n ` + "`" + messages + "`")
        .setColor("BLURPLE")
        .setTimestamp();

      user
        .send({ embeds: [embed] })
        .catch(() => {
          return "Cant Dm that user";
        })
        .then(() => {
          return `Sent Message to ${member.user.username}`;
        });
    } else {
      let embed = new MessageEmbed()
        .setTitle(`There is a message from staff of CMC`)
        .setAuthor({ name: interaction.user.username })
        .setDescription(`Message \n ` + "`" + messages + "`")
        .setColor("BLURPLE")
        .setTimestamp();

      user
        .send({ embeds: [embed] })
        .catch(() => {
          return "Cant Dm that user";
        })
        .then(() => {
          return `Sent Message to ${member.user.username}`;
        });
    }
  },
} as ICommand;
