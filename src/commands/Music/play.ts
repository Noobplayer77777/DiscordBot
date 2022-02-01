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
import { lavalink }from "../../main";

export default {
category: 'Music',
description: 'Plays a song from spotify',
expectedArgs: '<Search Term OR Link>',
expectedArgsTypes: ['STRING'],
slash: 'both',
testOnly: true,
callback: async({ args, message, interaction, member }) => {

   const { channel } = member.voice;

   if (!channel) return 'You need to be in a voice channel :)';
   if (!args.length) return 'You need to specify a URL or search term';
   let guildId:string = member.guild.id;
   let channelId:string 
   if (message) {
     channelId = message.channel?.id!
   } else {
     await interaction.deferReply();
     channelId = interaction.channel?.id!;
   } 
   

   
   const player = lavalink.create({
       guild:  guildId,
       textChannel: channelId,
       voiceChannel: channel.id
       
   })
     player.connect()
    try {
      if (player.state !== "CONNECTED")  player.connect();
    } catch (e) {
      console.error(`Expection occured at play.ts/54`, e)
    }
   
   const search = args.join(" ");
   let res;
   try {
    res = await player.search(search, member);
    if (res.loadType === 'LOAD_FAILED') {
        if (!player.queue.current) player.destroy();
        console.error(res.exception);
    }
   } catch (e) {
       return;
   }
   
   switch (res.loadType) {
    case 'NO_MATCHES':
      if (!player.queue.current) player.destroy();
      return message.reply('there were no results found.');
    case 'TRACK_LOADED':
      player.queue.add(res.tracks[0]);

      if (!player.playing && !player.paused && !player.queue.size) player.play();
      return message.reply(`enqueuing \`${res.tracks[0].title}\`.`);
    case 'PLAYLIST_LOADED':
      player.queue.add(res.tracks);

      if (!player.playing && !player.paused && player.queue.totalSize === res.tracks.length) player.play();
      return `enqueuing playlist \`${res.playlist?.name}\` with ${res.tracks.length} tracks.`
    case 'SEARCH_RESULT':
      
        let max = 5, collected, filter = (m:any) => m.author.id === member.id && /^(\d+|end)$/i.test(m.content);
      
     
      if (res.tracks.length < max) max = res.tracks.length;

      const results = res.tracks
          .slice(0, max)
          .map((track, index) => `${++index} - \`${track.title}\``)
          .join('\n');

      if (message) {
       await message.reply(results)
      } else {
       await interaction.followUp(results)
      };

      try {
        if (message) {
        collected = await message.channel?.awaitMessages({ filter, max: 1, time: 30e3, errors: ['time'] })!;
        } else {
        collected = await interaction.channel?.awaitMessages({ filter, max: 1, time: 30e3, errors: ['time'] })!;
        }

      } catch (e) {
        console.error(`Exception happended in play.ts/105`)
       if (message) {
         return 'Something went wrong';
       } else {
         interaction.followUp(`Something went wrong`)
         return;
       }
      }

      const first = collected.first()?.content!;

      if (first.toLowerCase() === 'end') {
        if (!player.queue.current) player.destroy();
        if (message) {
          message.reply(`Cancelled selection`)
         } else {
           interaction.followUp(`Cancelled selection`)
         }
        return;
      }

      const index = Number(first) - 1;
      if (index < 0 || index > max - 1) {
        if (message) {
          message.reply(`the number you provided is too small or too big (1-${max}).`)
         } else {
           interaction.followUp(`the number you provided is tooo small or too big (1-${max}).`)
         }
         return;
      }

      const track = res.tracks[index];
      player.queue.add(track);
   try {
    if (!player.playing && !player.paused && !player.queue.size) player.play();
    if (message) {
      message.channel.send(`Queuing \` ${track.title} \``)
     } else {
       interaction.followUp(`Queuing \` ${track.title} \` `)
     }
    
   }  catch (e) {
     console.error('Expection happended at play.ts/147', e)
   } 
   
     

    }
}
} as ICommand
