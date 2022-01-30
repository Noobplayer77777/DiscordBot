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
const discord_js_1 = require("discord.js");
const punishment_1 = __importDefault(require("../../src/database/mongo/schemas/punishment"));
exports.default = (client) => {
    client.on("guildMemberAdd", (member) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield punishment_1.default.findOne({
            userId: member.id,
            type: "mute",
        });
        if (result) {
            const mutedRole = member.guild.roles.cache.find((role) => role.name === "Muted");
            member.roles.add(mutedRole);
        }
    }));
    const check = () => __awaiter(void 0, void 0, void 0, function* () {
        const query = {
            expires: { $lt: new Date() },
        };
        const results = yield punishment_1.default.find(query);
        for (const result of results) {
            const { userId, type } = result;
            const guild = yield client.guilds.fetch("929950822857584650"); /** Will be Changed Later to bots guild this is test servers id not Cmcs */
            if (type === "ban") {
                guild.members.unban(userId, "Ban Expired");
            }
            else if (type === "mute") {
                const muterole = guild.roles.cache.find((role) => role.name === "Muted");
                const member = guild.members.cache.get(userId);
                if (!member)
                    continue;
                member.roles.remove(muterole);
                const embed = new discord_js_1.MessageEmbed()
                    .setTitle("Your Mute Has Expired")
                    .setAuthor({ name: `Cracked Minecraft Club` })
                    .setDescription(`Hello ${member.displayName} , Your Mute In Cracked Minecraft Club Discord Server Has Expired \n Your Now free to chat in our server but please Try to always maintain the rules `)
                    .setColor("GREEN")
                    .setTimestamp();
                try {
                    member.send({ embeds: [embed] });
                }
                catch (err) {
                    continue;
                }
            }
        }
        yield punishment_1.default.deleteMany(query);
        setTimeout(check, 1000 * 60);
    });
    check();
};
exports.config = {
    dbName: "EXPIRED_PUNISHMENTS",
    displayName: "Expired Punishments",
};
