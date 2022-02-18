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

import axios from "axios";
import { Client, MessageEmbed, TextChannel } from "discord.js";
import pinger from "minecraft-pinger";
import ip from "ip";


export default async (client: Client) => {
  const message = await (
    client.channels.cache.get("942036745711661096") as TextChannel
  ).messages.fetch("942050562688557086");

  const eu = await pinger.pingPromise("mc.crackedminecraft.club", 25565);
  const ap = await pinger.pingPromise("ind.crackedminecraft.club", 25565);

  const status = async () => {
    if (eu.ping || ap.ping) {
      let channel = (await client.channels.fetch(
        `942036745711661096`
      )) as TextChannel;
      channel.edit({ name: `🟢-Status` });
    } else {
        let channel = (await client.channels.fetch(
          `942036745711661096`
        )) as TextChannel;
        channel.edit({ name: ` 🔴 Status` });
    }

    const location = await axios.get(`http://ip-api.com/json/${ip.address()}`);
    try {
      const embed = new MessageEmbed()
        .setTitle(`EU is ${eu.ping ? `Online 🟢` : `Offline 🔴`}`)
        .setDescription(
          `Last Checked <t:${Math.round(
            new Date().getTime() / 1000
          )}:R> \n Getting ${eu.ping} from ${location.data.country},${location.data.regionName},${location.data.city} \n\` IP: mc.crackedminecraft.club\``
        )
        .setTimestamp()
        .setColor(eu.ping ? `GREEN` : `RED`)

        .setFooter({
          text: `Status checking using https://github.com/Grayson-code/node-minecraft-pinger `,
        });
      const embel = new MessageEmbed()
        .setTitle(`IN is ${ap.ping ? `Online 🟢` : `Offline 🔴`}`)
        .setDescription(
          `Last Checked <t:${Math.round(
            new Date().getTime() / 1000
          )}:R> \n Getting ${eu.ping} from ${location.data.country},${location.data.regionName},${location.data.city} \n\` IP: ind.crackedminecraft.club\``
        )
        .setTimestamp()
        .setColor(ap.ping ? `GREEN` : `RED`)

        .setFooter({
          text: `Status checking using https://github.com/Grayson-code/node-minecraft-pinger`,
        });
      await message.edit({
        embeds: [embed, embel],
        content: "Checks Every 60 Seconds",
      });
    } catch (e) {
      console.warn(e);
    }

    setInterval(status, 1000 * 60);
  };
  status();
};

export const config = {
  dbName: "STATUS",
  displayName: "Status",
};
