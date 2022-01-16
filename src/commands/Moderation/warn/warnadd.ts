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

export default {
category: 'Moderation',
description: `Warns a user`,
options: [
    {
        name: 'user',
        type: `USER`,
        description: 'The target',
        required: true,
    }, {
        name: 'reason',
        type: `STRING`,
        description: 'Reason for the warn',
        required: true,
    }

],
permissions: ['KICK_MEMBERS'],
slash: 'both',
testOnly: true,
callback: async({ guild, member: staff, interaction }) => { 
    
}


} as ICommand