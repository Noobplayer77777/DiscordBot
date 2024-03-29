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
import { MessageActionRow, MessageEmbed, User, TextChannel } from "discord.js";
import Schemas from "../../database/mongo/schemas/punishment";
import punishment from "../../database/mongo/schemas/punishment";

export default {
  category: "Moderation",
  description: "Helps in making someone You know Stop talking by force",
  permissions: ["BAN_MEMBERS"],
  minArgs: 3,
  expectedArgs: "<user> <duration> <reason>",
  expectedArgsTypes: ["USER", "STRING", "STRING"],
  slash: "both",
  testOnly: true,
  callback: async ({
    args,
    member: staff,
    guild,
    client,
    message,
    interaction,
  }) => {
    if (!guild) return "You can only use this inside a guild";

    let userId = args.shift()!;
    const duration = args.shift()!;
    const reason = args.join(" ");

    let user: User | undefined;

    if (message) {
      user = message.mentions.users.first();
    } else {
      user = interaction.options.getUser("user") as User;
    }

    if (!user) {
      userId = userId.replace(/[<@!>]/g, "");
      user = await client.users.fetch(userId);

      if (!user) {
        return "The User Doesnt Exist With the Id of" + userId;
      }
    }

    userId = user.id;

    let time;
    let type;

    try {
      const split = duration.match(/\d+|\D+/g);
      time = parseInt(split![0]);
      type = split![1].toLocaleLowerCase();
    } catch (e) {
      return "Invalid Time Format Use h // d // m";
    }

    if (type === "h") {
      time *= 60;
    } else if (type === "d") {
      time *= 60 * 24;
    } else if (type !== "m") {
      return "Invalid Time Format use h // d // m";
    }

    const expires = new Date();
    expires.setMinutes(expires.getMinutes() + time);

    const result = await punishment.findOne({
      userId,
      type: "mute",
    });

    if (result) return `<@${userId}> is already muted`;

    try {
      const member = await guild.members.fetch(userId);
      const embed = new MessageEmbed()
        .setAuthor({
          name: staff.displayName,
          iconURL: staff.displayAvatarURL(),
        })
        .setColor("DARK_RED")
        .setDescription(
          `Reason : ${reason} \n Staff : <@${staff.id}>  \n Time : ${duration} `
        );
      member.send({ embeds: [embed] });

      if (member) {
        const muterole = await guild.roles.fetch("932269728028827668");
        if (muterole) {
          await member.roles.add(muterole);
        }
      }

      await new Schemas({
        userId,
        staffId: staff.id,
        reason,
        expires,
        type: "mute",
      }).save();
      console.info(
        `Process > Bot > The Process has made a PUT request to database for registering an Mute`
      );
    } catch (err) {
      console.trace(
        `Process > Bot > The process has encountered an error while executing mute.ts \n`,
        err
      );
    }
    let embed2 = new MessageEmbed()
      .setTitle("Moderation Action")
      .setDescription(
        ` Type : Mute \n Victim : <@${userId}> \n Staff: <@${staff.id}> \n Duration: ${duration}`
      )
      .setColor("DARK_RED")
      .setAuthor({
        name: staff.user.username,
        iconURL: staff.displayAvatarURL(),
      })
      .setThumbnail(user.displayAvatarURL())
      .setTimestamp();
    const channels = (await client.channels.fetch(
      "933582319187538001"
    )) as TextChannel;
    channels.send({ embeds: [embed2] });

    return `<@${userId}> has been muted for ${duration}`;
  },
} as ICommand;
