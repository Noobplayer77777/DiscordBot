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

import { Client } from "discord.js";
import WOKCommands from "wokcommands";
import path from "path";
import dotenv from "dotenv";
import { Manager } from "erela.js";
dotenv.config();

const nodes = [
  {
    host: process.env.Host,
    password: process.env.Password,
    port: process.env.Port,
  },
];

const client = new Client({
  intents: 8071,
  presence: {
    status: "dnd",
  },
});

client.on("ready", async () => {
  client.user?.setActivity("Sequelize It!!!", { type: "WATCHING" });
  new WOKCommands(client, {
    typeScript: true,
    commandDir: path.join(__dirname, "commands"),
    featureDir: path.join(__dirname, "events"),
    botOwners: [
      "787977601976631336",
      "563354238156275712",
      "839838899432849428",
    ],
    delErrMsgCooldown: 2,
    ephemeral: false,
    testServers: [
      "929950822857584650",
      "931924563384741929",
      "807616952650301440",
    ],
    mongoUri: process.env.Mongo,
    disabledDefaultCommands: [
      "langauge",
      "requiredrike",
      "channelonly",
      "slash",
    ],
  }).setDefaultPrefix("!");
});

client.login(process.env.TOKEN);
