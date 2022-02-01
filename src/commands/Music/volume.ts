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
import { lavalink } from "../../main";

export default {
  category: "Music",
  description: "Increases or decreases the volume of the player",
  aliases: ["v"],
  expectedArgs: "[Number]",
  expectedArgsTypes: ["NUMBER"],
  testOnly: true,
  slash: "both",
  callback: async ({ member, args }) => {
    const player = lavalink.get(member.guild.id);
    if (!player) {
      return "There is no music player for this guild";
    }

    const { channel } = member.voice;
    if (!channel) {
      return "You have to be in a voice channel to do this :)";
    }

    if (channel.id !== player.voiceChannel) {
      return "Your not in the same voice channel as the player!";
    }

    const volume = Number(args[0]);
    if (!volume || volume < 1 || volume > 100) {
      return "you need to give me a volume between 1 and 100.";
    }

    player.setVolume(volume);
    return `set the player volume to \`${volume}\`.`;
  },
} as ICommand;
