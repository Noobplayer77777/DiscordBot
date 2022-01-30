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
const discord_js_1 = require("discord.js");
const punishment_1 = __importDefault(require("../../database/mongo/schemas/punishment"));
const punishment_2 = __importDefault(require("../../database/mongo/schemas/punishment"));
exports.default = {
    category: "Moderation",
    description: "Helps in making someone be erased from reality",
    permissions: ["BAN_MEMBERS"],
    minArgs: 3,
    expectedArgs: "<user> <duration> [perm] <reason>",
    expectedArgsTypes: ["USER", "STRING", "BOOLEAN", "STRING"],
    slash: "both",
    testOnly: true,
    callback: ({ args, member: staff, guild, client, message, interaction, }) => __awaiter(void 0, void 0, void 0, function* () {
        if (!guild)
            return "You can only use this inside a guild";
        let userId = args.shift();
        const duration = args.shift();
        let perm;
        if (message)
            perm = args.shift();
        if (interaction)
            perm = interaction.options.getBoolean("perm");
        const reason = args.join(" ");
        let user;
        if (message) {
            user = message.mentions.users.first();
        }
        else {
            user = interaction.options.getUser("user");
        }
        if (!user) {
            userId = userId.replace(/[<@!>]/g, "");
            user = yield client.users.fetch(userId);
            if (!user) {
                return "The User Doesnt Exist With the Id of " + userId;
            }
        }
        userId = user.id;
        let time;
        let type;
        try {
            const split = duration.match(/\d+|\D+/g);
            time = parseInt(split[0]);
            type = split[1].toLocaleLowerCase();
        }
        catch (e) {
            return "Invalid Time Format Use h // d // m // perm for hours , days , minutes , permenently respectivly ";
        }
        if (type === "h") {
            time *= 60;
        }
        else if (type === "d") {
            time *= 60 * 24;
        }
        else if (type !== "m") {
            return "Invalid Time Format use h // d // m";
        }
        const expires = new Date();
        expires.setMinutes(expires.getMinutes() + time);
        const result = yield punishment_2.default.findOne({
            userId,
            type: "ban",
        });
        if (result)
            return `<@${userId}> is already banned`;
        try {
            const member = yield guild.members.fetch(userId);
            if (!member.kickable)
                return "Cant ban this user due to permission reasons";
            if (!member) {
                return "`Cant Fetch The User as a GuildMember`";
            }
            const embed = new discord_js_1.MessageEmbed()
                .setAuthor({
                name: staff.displayName,
                iconURL: staff.displayAvatarURL(),
            })
                .setTitle(`Banned`)
                .setColor("RED")
                .setDescription(`Reason : ${reason} \n Staff : <@${staff.id}>  \n Time : ` +
                (perm ? `Permenent` : duration))
                .setImage(`https://i.imgur.com/OIvqxNK.png`)
                .setThumbnail(`https://cdn.discordapp.com/icons/807616952650301440/684b714914eed2de259448fe01f53dde.png?size=4096`);
            yield member.send({ embeds: [embed] });
            if (message) {
                if (perm === "true") {
                    if (member) {
                        member.ban({ days: 7, reason: reason });
                    }
                }
                else {
                    yield new punishment_1.default({
                        userId,
                        staffId: staff.id,
                        reason,
                        expires,
                        type: "ban",
                    }).save();
                    member.ban({ days: 7, reason: reason });
                }
            }
            else {
                if (perm) {
                    member.ban({ days: 7, reason: reason });
                }
                else {
                    yield new punishment_1.default({
                        userId,
                        staffId: staff.id,
                        reason,
                        expires,
                        type: "ban",
                    }).save();
                    member.ban({ days: 7, reason: reason });
                }
            }
        }
        catch (err) {
            throw err;
        }
        let embed2 = new discord_js_1.MessageEmbed()
            .setTitle("Moderation Action")
            .setDescription(` Type : Ban \n Victim : <@${user}> \n Staff: <@${staff.id}> \n Duration: ${type}`)
            .setThumbnail(user.displayAvatarURL())
            .setColor("DARK_RED")
            .setAuthor({
            name: staff.user.username,
            iconURL: staff.displayAvatarURL(),
        })
            .setTimestamp();
        const channels = (yield client.channels.fetch("933582319187538001"));
        channels.send({ embeds: [embed2] });
        return `<@${userId}> has been banned for ${duration}`;
    }),
};
