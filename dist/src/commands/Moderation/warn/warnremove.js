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
const warn_1 = __importDefault(require("../../../database/mongo/schemas/warn"));
exports.default = {
    category: "Moderation",
    description: "Lists all the warns of the user",
    expectedArgs: "<userid>",
    expectedArgsTypes: ["STRING"],
    slash: "both",
    permissions: ["KICK_MEMBERS"],
    callback: ({ member: staff, args, interaction, message, client }) => __awaiter(void 0, void 0, void 0, function* () {
        let user;
        if (message) {
            user = args.shift();
        }
        else {
            user = interaction.options.getString("userid");
        }
        const warning = yield warn_1.default.findByIdAndDelete(user);
        const users = yield yield client.users.fetch(`${user}`);
        let embed2 = new discord_js_1.MessageEmbed()
            .setTitle("Moderation Action")
            .setDescription(` Type : Warn Remove \n Victim : <@${user}> \n Staff: <@${staff.id}> \n Duration: Permenant`)
            .setColor("GREEN")
            .setAuthor({
            name: staff.user.username,
            iconURL: staff.displayAvatarURL(),
        })
            .setTimestamp()
            .setThumbnail(users.displayAvatarURL());
        const channels = (yield client.channels.fetch("933582319187538001"));
        channels.send({ embeds: [embed2] });
        return {
            custom: true,
            content: `Removed warning ${warning.id} from <@${user}>`,
            allowedMentions: {
                users: [],
            },
        };
    }),
};
