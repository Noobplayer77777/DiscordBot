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



const client = new Client({
  intents: 14215,
  presence: {
    status: "dnd",
  },
});

export const lavalink = new Manager({
  nodes: [{
    host: process.env.Host!,
    password: process.env.Password!,
    port: 25649
  }],
  autoPlay: true,
  send: (id, payload) => {
    const guild = client.guilds.cache.get(id);
    if (guild) guild.shard.send(payload);
  }
})


lavalink.on("nodeConnect", node => {
  console.log(`Lavalink: ${node.options.identifier} has connected`);
  
})

lavalink.on("nodeError", (node , err) => {
  console.log(`Node ${node.options.identifier} has encountered an error: ${err.message}`)
})

client.on("ready", async () => {
  lavalink.init(client.user?.id)

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

client.on("raw", d => lavalink.updateVoiceState(d));

client.login(process.env.TOKEN);
