"use strict";
// // Copyright 2022 Northern Star
// //
// // Licensed under the Apache License, Version 2.0 (the "License");
// // you may not use this file except in compliance with the License.
// // You may obtain a copy of the License at
// //
// //     http://www.apache.org/licenses/LICENSE-2.0
// //
// // Unless required by applicable law or agreed to in writing, software
// // distributed under the License is distributed on an "AS IS" BASIS,
// // WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// // See the License for the specific language governing permissions and
// // limitations under the License.
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
exports.default = {
    category: "Moderation",
    description: "Kicks a guildMember",
    expectedArgs: `<user> <reason>`,
    expectedArgsTypes: ["USER", "STRING"],
    permissions: ["KICK_MEMBERS"],
    guildOnly: true,
    slash: "both",
    testOnly: true,
    callback: ({ message, interaction, args, client, guild, member: staff, }) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c;
        let user;
        let userId = args.shift();
        const reason = args.join(" ");
        if (message) {
            user = message.mentions.users.first();
        }
        else {
            user = interaction.options.getUser("user");
        }
        if (!user) {
            userId = userId.replace(/[<@!>]/g, "");
            user = yield client.users.fetch(userId);
            if (!user)
                return "Cant find that user!";
        }
        try {
            if (!guild)
                return;
            const member = yield ((_a = guild.members) === null || _a === void 0 ? void 0 : _a.fetch(user.id));
            if (!member.kickable)
                return "Cant kick this user due to permission reasons";
            member.kick(reason);
        }
        catch (err) {
            return "Cant Kick that user!";
        }
        try {
            const embed = new discord_js_1.MessageEmbed()
                .setTitle(`You have been kicked from CMC`)
                .setDescription(`You have been kicked by staff in cmc for \`${reason}\``)
                .setAuthor({
                name: message
                    ? (_b = message.author) === null || _b === void 0 ? void 0 : _b.username
                    : (_c = interaction.member) === null || _c === void 0 ? void 0 : _c.user.username,
                iconURL: message
                    ? message.author.displayAvatarURL()
                    : interaction.user.displayAvatarURL(),
            })
                .setColor("DARK_RED")
                .setTimestamp();
            user.send({ embeds: [embed] });
        }
        catch (err) {
            return `Kicked <@${user.id}> , But couldnt Dm them`;
        }
        let embed2 = new discord_js_1.MessageEmbed()
            .setTitle("Moderation Action")
            .setDescription(` Type : Kick \n Victim : <@${user}> \n Staff: <@${staff.id}> \n Duration: Once`)
            .setColor("DARK_RED")
            .setAuthor({
            name: staff.user.username,
            iconURL: staff.displayAvatarURL(),
        })
            .setTimestamp();
        const channels = (yield client.channels.fetch("933582319187538001"));
        channels.send({ embeds: [embed2] });
        return `<@${user.id}> has been kicked for ${reason}`;
    }),
};
