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
import { Client, MessageEmbed, TextChannel } from 'discord.js'

export default (client:Client) => {
  client.on("messageDelete", async (message) => {
       const moglog = await client.channels.fetch("933582319187538001") as TextChannel
       let embed = new MessageEmbed()
       .setTitle('Message Deleted')
       .setDescription(`Message :\` ${message.content} \` Author: ${message.author}`)
       .setColor("YELLOW")
       .setTimestamp();
       moglog.send({ embeds:[embed] })
  })
}