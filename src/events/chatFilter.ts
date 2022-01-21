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

import { Client, Message, MessageEmbed, TextChannel } from "discord.js";
import Forbidden from "../../forbidden.json";

export default (client: Client) => {
  client.on("messageCreate", async (message) => {
    const modlog = await client.channels.fetch('933582319187538001') as TextChannel/*Need to change*/
    const rRole = await message.guild?.members.fetch(message.author.id);
    if (rRole?.roles.cache.has(`933729350887538689`)) return;
    if (!message.guild) return;
    if (message.content.length >= 500) {
      message.delete();
      message.channel.send(
        `${message.author} , Your not allowed to send messages containing more than 500 characters`
      );
      const embed = new MessageEmbed()
      .setTitle(`AutoMod Violation`)
      .setDescription(`Author: ${message.author} \n Type: More than 500 characters \n Message: \`${message.content}\``)
      .setColor("DARK_RED")
      .setTimestamp()
      .setFooter({ text: `${message.author.id}`})

      modlog.send({ embeds:[embed] })


      return;
    }

    function isValidURL(string: any) {
      var res = string.match(
        /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
      );
      return res !== null;
    }
    var testContent = message.content;
    if (isValidURL(testContent)) {
      
      message.delete();
      await message.channel.send(`Links are forbidden ${message.author}`);
      const embed = new MessageEmbed()
      .setTitle(`AutoMod Violation`)
      .setDescription(`Author: ${message.author} \n Type: Links \n Message: \`${message.content}\``)
      .setColor("DARK_RED")
      .setTimestamp()
      .setFooter({ text: `${message.author.id}`})

      modlog.send({ embeds:[embed] })
      
      return;
    }

    if (
      Forbidden.words.some((w) =>
        `${message.content.toLocaleLowerCase()}`.includes(`${w}`)
      )
    ) {
      message.channel.send(`${message.author} Watch Your language!`);
      message.member?.send(
        `Your Message has been flagged for forbidden words \n Message: ${message.content}`
      );
      await message.delete();
      

      const embed = new MessageEmbed()
      .setTitle(`AutoMod Violation`)
      .setDescription(`Author: ${message.author} \n Type: Forbidden Words \n Message: \`${message.content}\``)
      .setColor("DARK_RED")
      .setTimestamp()
      .setFooter({ text: `${message.author.id}`})

      modlog.send({ embeds:[embed] })
    }
  });
};
