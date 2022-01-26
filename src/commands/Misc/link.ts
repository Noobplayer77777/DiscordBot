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

import { MessageEmbed } from "discord.js";
import { ICommand } from "wokcommands";

export default {
  category: "Information",
  description: "Gives link to all our socials",
  syntax: "both",
  testOnly: true,
  callback: async ({}) => {
    const embed = new MessageEmbed()
      .setTitle("Our Socials")
      .setDescription(`{const} {const}`)
      .setColor("GREEN")
      .setTimestamp(); /** Unfinished due to un availability of links*/
    return {
      custom: true,
      embeds: [embed],
    };
  },
} as ICommand;
