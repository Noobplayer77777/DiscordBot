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

import { ICommand } from "wokcommands";
import { MessageActionRow, User } from "discord.js";
import Schemas from "../../database/mongo/schemas/punishment";

export default {
  category: "Moderation",
  description: "Helps in making someone You know Stop talking by force",
  permissions: ["BAN_MEMBERS"],
  minArgs: 3,
  expectedArgs: "<user> <duration> <reason>",
  expectedArgsTypes: ["USER", "STRING", "STRING"],
  slash: "both",
  testOnly: true,
  callback: async ({
    args,
    member: staff,
    guild,
    client,
    message,
    interaction,
  }) => {
    if (!guild) return "You can only use this inside a guild";

    let userId = args.shift()!;
    const duration = args.shift()!;
    const reason = args.join(' ');

    let user: User | undefined

    if (message) {
    user = message.mentions.users.first();
    } else {
    user = interaction.options.getUser('user') as User;
    }
  },
} as ICommand;
