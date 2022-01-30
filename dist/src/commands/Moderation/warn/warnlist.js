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
    description: "lists all warns",
    names: "warn-list",
    expectedArgs: "<user>",
    expectedArgsTypes: ["USER"],
    permissions: ["SEND_MESSAGES"],
    slash: "both",
    testOnly: true,
    callback: ({ member: staff, interaction, message, args, client }) => __awaiter(void 0, void 0, void 0, function* () {
        let userId = args.shift();
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
        }
        userId = user.id;
        const warnings = yield warn_1.default.find({
            userId: user === null || user === void 0 ? void 0 : user.id,
        });
        let description = `Warnings for <@${user === null || user === void 0 ? void 0 : user.id}>:\n\n`;
        for (const warn of warnings) {
            description += `**MongoID ${warn._id}`;
            description += `**UserID:** ${warn.userId}\n`;
            description += `**Date:** ${warn.createdAt.toLocaleString()}\n`;
            description += `**Staff** <@${warn.staffId}>\n`;
            description += `**Reason** ${warn.reason}\n\n`;
        }
        const embed = new discord_js_1.MessageEmbed()
            .setDescription(description)
            .setColor("BLUE");
        return embed;
    }),
};
