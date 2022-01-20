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

import { Client, MessageEmbed, Role } from "discord.js";
import schema from "../../src/database/mongo/schemas/punishment";

export default (client: Client) => {
  client.on("guildMemberAdd", async (member) => {
    const result = await schema.findOne({
      userId: member.id,
      type: "mute",
    });

    if (result) {
      const mutedRole = member.guild.roles.cache.find(
        (role) => role.name === "Muted"
      ) as Role;
      member.roles.add(mutedRole);
    }
  });

  const check = async () => {
    const query = {
      expires: { $lt: new Date() },
    };

    const results = await schema.find(query);

    for (const result of results) {
      const { userId, type } = result;

      const guild = await client.guilds.fetch(
        "929950822857584650"
      ); /** Will be Changed Later to bots guild this is test servers id not Cmcs */

      if (type === "ban") {
        guild.members.unban(userId, "Ban Expired");
      } else if (type === "mute") {
        const muterole = guild.roles.cache.find(
          (role) => role.name === "Muted"
        ) as Role;
        const member = guild.members.cache.get(userId);
        if (!member) continue;
        member.roles.remove(muterole);
        const embed = new MessageEmbed()
          .setTitle("Your Mute Has Expired")
          .setAuthor({ name: `Cracked Minecraft Club` })
          .setDescription(
            `Hello ${member.displayName} , Your Mute In Cracked Minecraft Club Discord Server Has Expired \n Your Now free to chat in our server but please Try to always maintain the rules `
          )
          .setColor("GREEN")
          .setTimestamp();
        try {
          member.send({ embeds: [embed] });
        } catch (err) {
          continue;
        }
      }
    }

    await schema.deleteMany(query);
    setTimeout(check, 1000 * 60);
  };
  check();
};

export const config = {
  dbName: "EXPIRED_PUNISHMENTS",
  displayName: "Expired Punishments",
};
