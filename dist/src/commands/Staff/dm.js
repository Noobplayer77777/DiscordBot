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
exports.default = {
    category: "Staff Utility",
    description: "Dms A guild member",
    aliases: ["pm"],
    expectedArgs: "<user> <message>",
    expectedArgsTypes: ["USER", "STRING"],
    slash: "both",
    testOnly: true,
    callback: ({ message, interaction, args, client, member }) => __awaiter(void 0, void 0, void 0, function* () {
        let users = args.shift();
        if (!users)
            return "No user is defined";
        const messages = args.join(" ");
        if (messages.includes("@everyone" || "@here"))
            return;
        let user;
        if (message) {
            user = message.mentions.users.first();
        }
        else {
            user = interaction.options.getUser("user");
        }
        if (!user) {
            users = users.replace(/[<@!>]/g, "");
            user = yield client.users.fetch(users);
            if (!user) {
                return "The user doesnt exist";
            }
        }
        users = user.id;
        let embed;
        if (message) {
            let embed = new discord_js_1.MessageEmbed()
                .setTitle(`There is a message from staff of CMC`)
                .setAuthor({
                name: message.author.username,
                iconURL: message.author.displayAvatarURL(),
            })
                .setDescription(`Message \n ` + "`" + messages + "`")
                .setColor("BLURPLE")
                .setTimestamp();
            yield user
                .send({ embeds: [embed] })
                .catch(() => {
                return "Cant Dm that user";
            })
                .then(() => {
                return `Sent Message to ${member.user.username}`;
            });
        }
        else {
            let embed = new discord_js_1.MessageEmbed()
                .setTitle(`There is a message from staff of CMC`)
                .setAuthor({
                name: interaction.user.username,
                iconURL: interaction.user.displayAvatarURL(),
            })
                .setDescription(`Message \n ` + "`" + messages + "`")
                .setColor("BLURPLE")
                .setTimestamp();
            try {
                yield user.send({ embeds: [embed] });
            }
            catch (err) {
                message
                    ? yield message.channel.send({
                        content: "Cant send message to that user",
                    })
                    : yield interaction.reply({
                        content: "Cant send message to that user",
                    });
            }
            finally {
                message
                    ? yield message.channel.send({
                        content: "Sent Message to that user",
                    })
                    : yield interaction.reply({ content: "Sent Message to that user" });
            }
        }
    }),
};
