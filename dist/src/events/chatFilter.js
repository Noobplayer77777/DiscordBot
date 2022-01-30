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
const forbidden_json_1 = __importDefault(require("../../forbidden.json"));
exports.default = (client) => {
    client.on("messageCreate", (message) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        const modlog = (yield client.channels.fetch("933582319187538001")); /*Need to change*/
        const rRole = yield ((_a = message.guild) === null || _a === void 0 ? void 0 : _a.members.fetch(message.author.id));
        if (rRole === null || rRole === void 0 ? void 0 : rRole.roles.cache.has(`933729350887538689`))
            return;
        if (!message.guild)
            return;
        if (message.content.length >= 500) {
            message.delete();
            message.channel.send(`${message.author} , Your not allowed to send messages containing more than 500 characters`);
            const embed = new discord_js_1.MessageEmbed()
                .setTitle(`AutoMod Violation`)
                .setDescription(`Author: ${message.author} \n Type: More than 500 characters \n Message: \`${message.content}\``)
                .setColor("DARK_RED")
                .setTimestamp()
                .setFooter({ text: `${message.author.id}` });
            modlog.send({ embeds: [embed] });
            return;
        }
        function isValidURL(string) {
            var res = string.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
            return res !== null;
        }
        var testContent = message.content;
        if (isValidURL(testContent)) {
            message.delete();
            yield message.channel.send(`Links are forbidden ${message.author}`);
            const embed = new discord_js_1.MessageEmbed()
                .setTitle(`AutoMod Violation`)
                .setDescription(`Author: ${message.author} \n Type: Links \n Message: \`${message.content}\``)
                .setColor("DARK_RED")
                .setTimestamp()
                .setFooter({ text: `${message.author.id}` });
            modlog.send({ embeds: [embed] });
            return;
        }
        if (forbidden_json_1.default.words.some((w) => `${message.content.toLocaleLowerCase()}`.includes(`${w}`))) {
            message.channel.send(`${message.author} Watch Your language!`);
            (_b = message.member) === null || _b === void 0 ? void 0 : _b.send(`Your Message has been flagged for forbidden words \n Message: ${message.content}`);
            yield message.delete();
            const embed = new discord_js_1.MessageEmbed()
                .setTitle(`AutoMod Violation`)
                .setDescription(`Author: ${message.author} \n Type: Forbidden Words \n Message: \`${message.content}\``)
                .setColor("DARK_RED")
                .setTimestamp()
                .setFooter({ text: `${message.author.id}` });
            modlog.send({ embeds: [embed] });
        }
    }));
};
