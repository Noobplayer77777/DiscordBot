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
const discord_js_1 = require("discord.js");
const main_1 = require("../../main");
exports.default = {
    description: "Shows the full queue",
    category: "Music",
    testOnly: true,
    slash: "both",
    callback: ({ member, interaction, args }) => __awaiter(void 0, void 0, void 0, function* () {
        const player = main_1.lavalink.get(member.guild.id);
        if (!player) {
            return "There is no player.";
        }
        if (interaction) {
            interaction.deferReply();
        }
        const queue = player.queue;
        const embed = new discord_js_1.MessageEmbed().setAuthor({
            name: `Queue for this player`,
        });
        const multiple = 10;
        const page = args.length && Number(args[0]) ? Number(args[0]) : 1;
        const end = page * multiple;
        const start = end - multiple;
        const tracks = queue.slice(start, end);
        if (queue.current) {
            embed.addField("Current", `[${queue.current.title}](${queue.current.uri})`);
        }
        if (!tracks.length) {
            embed.setDescription(`No Tracks in ${page > 1 ? `page ${page}` : "the queue"}`);
        }
        else {
            embed.setDescription(tracks
                .map((track, i) => `${start + ++i} - [${track.title}](${track.uri})`)
                .join("\n"));
        }
        const maxPages = Math.ceil(queue.length / multiple);
        embed.setFooter(`Page ${page > maxPages ? maxPages : page} of ${maxPages}`);
        if (interaction) {
            interaction.followUp({ embeds: [embed] });
        }
        else {
            return {
                custom: true,
                embeds: [embed],
            };
        }
    }),
};
