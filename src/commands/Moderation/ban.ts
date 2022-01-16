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
import { MessageActionRow, MessageEmbed, User } from "discord.js";
import Schemas from "../../database/mongo/schemas/punishment";
import punishment from "../../database/mongo/schemas/punishment";

export default {
  category: "Moderation",
  description: "Helps in making someone be erased from reality",
  permissions: ["BAN_MEMBERS"],
  minArgs: 3,
  expectedArgs: "<user> <duration> [perm] <reason>",
  expectedArgsTypes: ["USER", "STRING", "BOOLEAN", "STRING"],
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
    let perm;
    if (message) perm = args.shift()!;
    if (interaction) perm = interaction.options.getBoolean("perm") as Boolean;
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
        return "The User Doesnt Exist With the Id of " + userId;
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
      return "Invalid Time Format Use h // d // m // perm for hours , days , minutes , permenently respectivly ";
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
      type: "ban",
    });

    if (result) return `<@${userId}> is already banned`;

    try {
      const member = await guild.members.fetch(userId)!;
      if (!member) {
        return "`Cant Fetch The User as a GuildMember`";
      }
      const embed = new MessageEmbed()
        .setAuthor({
          name: staff.displayName,
          iconURL: staff.displayAvatarURL(),
        })
        .setTitle(`Banned`)
        .setColor("RED")
        .setDescription(
          `Reason : ${reason} \n Staff : <@${staff.id}>  \n Time : ` + (perm
            ? `Permenent`
            : duration)
        )
        .setImage(`https://i.imgur.com/OIvqxNK.png`)
        .setThumbnail(`https://cdn.discordapp.com/icons/807616952650301440/684b714914eed2de259448fe01f53dde.png?size=4096`)

     await member.send({ embeds: [embed] });
      if (message) {
        if (perm === "true") {
          if (member) {
            member.ban({ days: 7, reason: reason });
          }
        } else {
            await new Schemas({
              userId,
              staffId: staff.id,
              reason,
              expires,
              type: "ban",
            }).save();

            member.ban({ days: 7, reason: reason });
            
          
        }
      } else {
        
        if (perm) {
          member.ban({ days: 7, reason: reason });
        } else {
          await new Schemas({
            userId,
            staffId: staff.id,
            reason,
            expires,
            type: "ban",
          }).save();

          member.ban({ days: 7, reason: reason });
        }

      }
    } catch (err) {
      throw err;
    }

    return `<@${userId}> has been banned for ${duration}`;
  },
} as ICommand;
