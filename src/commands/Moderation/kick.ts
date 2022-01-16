// // Copyright 2022 Northern Star
// // 
// // Licensed under the Apache License, Version 2.0 (the "License");
// // you may not use this file except in compliance with the License.
// // You may obtain a copy of the License at
// // 
// //     http://www.apache.org/licenses/LICENSE-2.0
// // 
// // Unless required by applicable law or agreed to in writing, software
// // distributed under the License is distributed on an "AS IS" BASIS,
// // WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// // See the License for the specific language governing permissions and
// // limitations under the License.

import { MessageEmbed, User } from "discord.js";
import { ICommand } from "wokcommands";

export default {
  category: 'Moderation',
  description: 'Kicks a guildMember',
  expectedArgs: `<user> <reason>`,
  expectedArgsTypes: ['USER', 'STRING'],
  permissions: ['KICK_MEMBERS'],
  guildOnly: true,
  slash: 'both',
  testOnly: true,
  callback: async ({ message, interaction, args, client, guild }) => { 
     let user: User | undefined;
     let userId = args.shift()!;
     const reason = args.join(" ");

     if (message) {
     user = message.mentions.users.first();
     } else {
         user = interaction.options.getUser("user") as User;
     }

     if (!user) {
     userId = userId.replace(/[<@!>]/g, '');
     user = await client.users.fetch(userId);

     if (!user) return 'Cant find that user!';
     }
     try { 
         if (!guild) return;
        const member = await guild.members?.fetch(user.id)!;
        member.kick(reason);
     } catch (err) {
      return 'Cant Kick that user!'
     }
     try { 
         const embed = new MessageEmbed()
         .setTitle(`You have been kicked from CMC`)
         .setDescription(`You have been kicked by staff in cmc for \`${reason}\``)
         .setAuthor({ name:message? message.author?.username! : interaction.member?.user.username!, iconURL: message? message.author.displayAvatarURL() : interaction.user.displayAvatarURL() })
         .setColor('DARK_RED')
         .setTimestamp();

         user.send({ embeds: [embed] });
     } catch (err) {
     return `Kicked <@${user.id}> , But couldnt Dm them`;
     }
     
     return `<@${user.id}> has been kicked for ${reason}`
  }
} as ICommand