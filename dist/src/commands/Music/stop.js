"use strict";
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const main_1 = require("../../main");
exports.default = {
    category: "Music",
    description: "Stops the player!",
    aliases: ["s"],
    testOnly: true,
    slash: "both",
    callback: ({ member }) => __awaiter(void 0, void 0, void 0, function* () {
        const player = main_1.lavalink.get(member.guild.id);
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
        player.destroy();
        return "The player has stopped";
    }),
};
