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
    aliases: ['p'],
    description: "Plays a song from spotify",
    expectedArgs: "<Search Term OR Link>",
    expectedArgsTypes: ["STRING"],
    slash: "both",
    testOnly: true,
    callback: ({ args, message, interaction, member }) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f;
        const { channel } = member.voice;
        if (!channel)
            return "You need to be in a voice channel :)";
        if (!args.length)
            return "You need to specify a URL or search term";
        let guildId = member.guild.id;
        let channelId;
        if (message) {
            channelId = (_a = message.channel) === null || _a === void 0 ? void 0 : _a.id;
        }
        else {
            yield interaction.deferReply();
            channelId = (_b = interaction.channel) === null || _b === void 0 ? void 0 : _b.id;
        }
        const player = main_1.lavalink.create({
            guild: guildId,
            textChannel: channelId,
            voiceChannel: channel.id,
        });
        player.connect();
        try {
            if (player.state !== "CONNECTED")
                player.connect();
        }
        catch (e) {
            console.error(`Expection occured at play.ts/54`, e);
        }
        const search = args.join(" ");
        let res;
        try {
            res = yield player.search(search, member);
            if (res.loadType === "LOAD_FAILED") {
                if (!player.queue.current)
                    player.destroy();
                console.error(res.exception);
            }
        }
        catch (e) {
            return;
        }
        switch (res.loadType) {
            case "NO_MATCHES":
                if (!player.queue.current)
                    player.destroy();
                return message.reply("there were no results found.");
            case "TRACK_LOADED":
                player.queue.add(res.tracks[0]);
                if (!player.playing && !player.paused && !player.queue.size)
                    player.play();
                return message.reply(`enqueuing \`${res.tracks[0].title}\`.`);
            case "PLAYLIST_LOADED":
                player.queue.add(res.tracks);
                if (!player.playing &&
                    !player.paused &&
                    player.queue.totalSize === res.tracks.length)
                    player.play();
                return `enqueuing playlist \`${(_c = res.playlist) === null || _c === void 0 ? void 0 : _c.name}\` with ${res.tracks.length} tracks.`;
            case "SEARCH_RESULT":
                let max = 5, collected, filter = (m) => m.author.id === member.id && /^(\d+|end)$/i.test(m.content);
                if (res.tracks.length < max)
                    max = res.tracks.length;
                const results = res.tracks
                    .slice(0, max)
                    .map((track, index) => `${++index} - \`${track.title}\``)
                    .join("\n");
                if (message) {
                    yield message.reply(results);
                }
                else {
                    yield interaction.followUp(results);
                }
                try {
                    if (message) {
                        collected = yield ((_d = message.channel) === null || _d === void 0 ? void 0 : _d.awaitMessages({
                            filter,
                            max: 1,
                            time: 30e3,
                            errors: ["time"],
                        }));
                    }
                    else {
                        collected = yield ((_e = interaction.channel) === null || _e === void 0 ? void 0 : _e.awaitMessages({
                            filter,
                            max: 1,
                            time: 30e3,
                            errors: ["time"],
                        }));
                    }
                }
                catch (e) {
                    console.error(`Exception happended in play.ts/105`);
                    if (message) {
                        return "Something went wrong";
                    }
                    else {
                        interaction.followUp(`Something went wrong`);
                        return;
                    }
                }
                const first = (_f = collected.first()) === null || _f === void 0 ? void 0 : _f.content;
                if (first.toLowerCase() === "end") {
                    if (!player.queue.current)
                        player.destroy();
                    if (message) {
                        message.reply(`Cancelled selection`);
                    }
                    else {
                        interaction.followUp(`Cancelled selection`);
                    }
                    return;
                }
                const index = Number(first) - 1;
                if (index < 0 || index > max - 1) {
                    if (message) {
                        message.reply(`the number you provided is too small or too big (1-${max}).`);
                    }
                    else {
                        interaction.followUp(`the number you provided is tooo small or too big (1-${max}).`);
                    }
                    return;
                }
                const track = res.tracks[index];
                player.queue.add(track);
                try {
                    if (!player.playing && !player.paused && !player.queue.size)
                        player.play();
                    if (message) {
                        message.channel.send(`Queuing \` ${track.title} \``);
                    }
                    else {
                        interaction.followUp(`Queuing \` ${track.title} \` `);
                    }
                }
                catch (e) {
                    console.error("Expection happended at play.ts/147", e);
                }
        }
    }),
};
