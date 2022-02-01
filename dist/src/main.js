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
exports.lavalink = void 0;
const discord_js_1 = require("discord.js");
const wokcommands_1 = __importDefault(require("wokcommands"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const erela_js_1 = require("erela.js");
dotenv_1.default.config();
const client = new discord_js_1.Client({
    intents: 14215,
    presence: {
        status: "dnd",
    },
});
exports.lavalink = new erela_js_1.Manager({
    nodes: [{
            host: process.env.Host,
            password: process.env.Password,
            port: 25649
        }],
    autoPlay: true,
    send: (id, payload) => {
        const guild = client.guilds.cache.get(id);
        if (guild)
            guild.shard.send(payload);
    }
});
exports.lavalink.on("nodeConnect", node => {
    console.log(`Lavalink: ${node.options.identifier} has connected`);
});
exports.lavalink.on("nodeError", (node, err) => {
    console.log(`Node ${node.options.identifier} has encountered an error: ${err.message}`);
});
client.on("ready", () => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    exports.lavalink.init((_a = client.user) === null || _a === void 0 ? void 0 : _a.id);
    (_b = client.user) === null || _b === void 0 ? void 0 : _b.setActivity("Sequelize It!!!", { type: "WATCHING" });
    new wokcommands_1.default(client, {
        typeScript: true,
        commandDir: path_1.default.join(__dirname, "commands"),
        featureDir: path_1.default.join(__dirname, "events"),
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
}));
client.on("raw", d => exports.lavalink.updateVoiceState(d));
client.login(process.env.TOKEN);
