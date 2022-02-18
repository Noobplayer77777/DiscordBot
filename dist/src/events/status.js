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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const axios_1 = __importDefault(require("axios"));
const discord_js_1 = require("discord.js");
const minecraft_pinger_1 = __importDefault(require("minecraft-pinger"));
exports.default = (client) => __awaiter(void 0, void 0, void 0, function* () {
    const message = yield client.channels.cache.get("942036745711661096").messages.fetch("942050562688557086");
    let eu;
    let ap;
    try {
        eu = yield minecraft_pinger_1.default.pingPromise("mc.crackedminecraft.club", 25565);
        ap = yield minecraft_pinger_1.default.pingPromise("ind.crackedminecraft.club", 25565);
    }
    catch (e) {
        console.error(e);
    }
    const status = () => __awaiter(void 0, void 0, void 0, function* () {
        if (eu.ping & ap.ping) {
            let channel = (yield client.channels.fetch(`942036745711661096`));
            channel.edit({ name: `🟢-Status` });
        }
        else {
            let channel = (yield client.channels.fetch(`942036745711661096`));
            channel.edit({ name: ` 🔴 Status` });
        }
        const location = yield axios_1.default.get(`http://ip-api.com/json/`);
        try {
            const embed = new discord_js_1.MessageEmbed()
                .setTitle(`EU is ${eu.ping ? `Online 🟢` : `Offline 🔴`}`)
                .setDescription(`Last Checked <t:${Math.round(new Date().getTime() / 1000)}:R> \n Getting ${eu.ping} ms ping from ${location.data.country} ,${location.data.regionName} ,${location.data.city} \n\` IP: mc.crackedminecraft.club\``)
                .setTimestamp()
                .setColor(eu.ping ? `GREEN` : `RED`)
                .setFooter({
                text: `Status checking using https://github.com/Grayson-code/node-minecraft-pinger `,
            });
            const embel = new discord_js_1.MessageEmbed()
                .setTitle(`IN is ${ap.ping ? `Online 🟢` : `Offline 🔴`}`)
                .setDescription(`Last Checked <t:${Math.round(new Date().getTime() / 1000)}:R> \n Getting ${ap.ping} ms ping from ${location.data.country}, ${location.data.regionName}, ${location.data.city} \n\` IP: ind.crackedminecraft.club\``)
                .setTimestamp()
                .setColor(ap.ping ? `GREEN` : `RED`)
                .setFooter({
                text: `Status checking using https://github.com/Grayson-code/node-minecraft-pinger`,
            });
            yield message.edit({
                embeds: [embed, embel],
                content: "Checks Every 60 Seconds",
            });
        }
        catch (e) {
            console.warn(e);
        }
        setInterval(status, 1000 * 60);
    });
    status();
});
exports.config = {
    dbName: "STATUS",
    displayName: "Status",
};
