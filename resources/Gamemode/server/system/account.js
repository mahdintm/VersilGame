import { sql } from "../database/mysql";
import * as alt from 'alt'
import { logger } from "./logger";
import { hashing } from "../utils/hash";
import { DiscordHook } from "../utils/discord-hook";
import { sendchat } from "./chat";

var playersdata = {}
var Idx = {
    rp: {},
    rpg: {}
}
export class PlayerData {
    static async register(player, obj, Discordid = player.getSyncedMeta('Discordid')) {
        try {
            let dataMain = await sql('main', `INSERT INTO Account(rUsername, rPassword, rPhonenumber, rEmail, rDiscord, rSex, rFirstName, rLastName, rNotificationEmail, rNotificationPhone, rBrithday, rLastLogin, rCreateAt) VALUES("${(obj.main.Username).toLowerCase()}", "${await hashing.sjcl.ConvertToHash(obj.main.Password)}", "${obj.main.Phone}", "${obj.main.Email}", "${Discordid}", "${obj.main.RealSex}", "${obj.main.RealFirstName.charAt(0).toUpperCase() + obj.main.RealFirstName.slice(1)}", "${obj.main.RealLastName.charAt(0).toUpperCase() + obj.main.RealLastName.slice(1)}", "${obj.main.SendNotificationToEmail ? 1 : 0}", "${obj.main.SendNotificationToPhone ? 1 : 0}", "${obj.main.RealDateOfBirth}", "0", "${Date.now()}")`)
            await sql('rp', `UPDATE Account SET pFirstname="${obj.rp.FirstName}",pLirstname="${obj.rp.LastName}", pBirthDay="${obj.rp.DateOfBirth}" WHERE pId="${dataMain.insertId}"`)
            await PlayerData.login(player, { username: obj.main.Username, password: obj.main.Password })
            await DiscordHook.newhook.register({
                firstname: obj.main.RealFirstName.charAt(0).toUpperCase() + obj.main.RealFirstName.slice(1),
                lastname: obj.main.RealLastName.charAt(0).toUpperCase() + obj.main.RealLastName.slice(1),
                username: obj.main.Username,
                sqlid: dataMain.insertId,
                hwid: player.hwidHash,
                discordid: player.getSyncedMeta('Discordid'),
                ip: (player.ip).substr(7, 24),
                license: player.socialID
            });
            await sql('log', `INSERT INTO register_log(rId, loginas, ip, timestamp, hwid, discordid, license) VALUES ("${dataMain.insertId}","Server","${(player.ip).substr(7, 24)}","${Date.now()}","${player.hwidHash}","${player.getSyncedMeta('Discordid')}","${player.socialID}")`);
        } catch (error) {
            await logger.addlog.server({
                locatin: "Server->System->Account->Class Playerdata->register()",
                message: error
            })
        }
    };
    /**
     * for create data at login player
     * @param {object} player altv player object
     * @param {object} data player all data from all database
     * @param {string} username player entered user name
     */
    static async login(player, obj) {
        try {
            let dataMain = await sql('main', `select * FROM Account WHERE rUsername = "${(obj.username).toLowerCase()}"`);
            if (await hashing.sjcl.verify(obj.password, dataMain.rPassword) != true)
                return alt.emitClient(player, 'CallBack_Login_Account_To_Server', false);
            // if (dataMain.rOnline == 1)
            //     return console.log("online");
            //settingup Data
            let time = Date.now();
            let dataRP = await sql('rp', `select * FROM Account WHERE pId = "${dataMain.rId}"`);
            let dataRPG = await sql('rpg', `select * FROM Account WHERE pId = "${dataMain.rId}"`);
            await sql('main', `update Account set rOnline="${1}",rLastLogin="${time}" WHERE rId="${dataMain.rId}"`)
            playersdata[player.id] = { main: dataMain, rp: dataRP, rpg: dataRPG };
            playersdata[player.id]['main']['rUsername'] = obj.username;
            playersdata[player.id]['rpg']['pName'] = obj.username;
            alt.emitClient(player, 'CallBack_Login_Account_To_Server', true); //callback to client for hide login webview 
            playersdata[player.id]['rpg']['gameID'] = playerIdGame.set("rpg", player);
            await player.spawn(-66.84395599365234, -802.20615234375, 44.2255859375);
            // player.model = 'mp_f_freemode_01';
            player.dimension = 1;
            player.setSyncedMeta("hasLogin", true);
            //log system
            await sql('log', `INSERT INTO login_log(rId, loginas, ip, timestamp, hwid, discordid, license) VALUES ("${dataMain.rId}","Server","${(player.ip).substr(7, 24)}","${time}","${player.hwidHash}","${player.getSyncedMeta('Discordid')}","${player.socialID}")`);
            DiscordHook.newhook.login({ username: obj.username, sqlid: dataMain.rId, hwid: player.hwidHash, discordid: player.getSyncedMeta('Discordid'), ip: (player.ip).substr(7, 24), license: player.socialID });
            return alt.log(`~lc~ Player ${obj.username} With IP ${(player.ip).substr(7, 24)} at ${time} Logined.`);

        } catch (error) {
            await logger.addlog.server({
                locatin: "Server->System->Account->Class Playerdata->login()",
                message: error
            })
        }
    };
    /**
     * for get player data
     * @param {string} from in game ?
     * @param {Object} player altv player object
     * @param {String} DataName data name
     */
    static async get(from, player, DataName) {
        try {
            switch (from) {
                case "main":
                    return playersdata[player.id]['main'][DataName];
                case "rp":
                    return playersdata[player.id]['rp'][DataName];
                case "rpg":
                    return playersdata[player.id]['rpg'][DataName];
            }
        } catch (error) {
            await logger.addlog.server({
                locatin: "Server->System->Account->Class Playerdata->get()",
                message: error
            })
        }
    };
    /**
     * for set player data from server or database
     * @param {object} player 
     * @param {string} DataName 
     * @param {string} value 
     * @param {boolean} sync_sql 
     * @returns data
     */
    static async set(from, player, DataName, value, sync_sql = false) {
        try {
            switch (from) {
                case "main":
                    playersdata[player.id]['main'][DataName] = value;
                    if (sync_sql) await sql('main', `UPDATE Account SET ${DataName} = '${value}' WHERE rId = "${await PlayerData.get('main', player, "rId")}"`);
                    return playersdata[player.id]['main'][DataName];
                case "rp":
                    playersdata[player.id]['rp'][DataName] = value;
                    if (sync_sql) await sql('rp', `UPDATE Account SET ${DataName} = '${value}' WHERE pId = "${await PlayerData.get('rp', player, "pId")}"`);
                    return playersdata[player.id]['rp'][DataName];
                case "rpg":
                    playersdata[player.id]['rpg'][DataName] = value;
                    if (sync_sql) await sql("rpg", `UPDATE Account SET ${DataName} = '${value}' WHERE pId = "${await PlayerData.get('rpg', player, "pId")}"`);
                    return playersdata[player.id]['rpg'][DataName];
            }
        } catch (error) {
            await logger.addlog.server({
                locatin: "Server->System->Account->Class Playerdata->set()",
                message: error
            })
        }
    };
    /**
     * for delete data player from Server
     * @param {object} player altv player object
     */
    static async delete(player) {
        try {
            return delete playersdata[player.id];
        } catch (error) {
            await logger.addlog.server({
                locatin: "Server->System->Account->Class Playerdata->set()",
                message: error
            })
        }
    };
}

export class playerIdGame {
    static get = {
        /**
         * for get game id from player object altv
         * @param {object} player altv player object 
         * @returns game id
         */
        async idGameFromPlayerObject(player) {
            try {
                for (let i = 0; i < process.env.Max_PLAYER; i++) {
                    if (Idx[player.getSyncedMeta('inServer')][i] == player.id) {
                        return i
                    }
                }
            } catch (error) {
                await logger.addlog.server({
                    locatin: "Server->System->Account->Class playerIdGame->idGameFromPlayerObject()",
                    message: error
                })
            }
        },
        /**
         * for get player object from game id
         * @param {string} from Enter the server rp || rpg 
         * @param {number} enterdid enter the idgame 
         * @returns altv player object
         */
        async PlayerObjectFromGameid(from, enterdid) {
            try {
                return alt.players.getByID(Idx[enterdid][from]);
            } catch (error) {
                await logger.addlog.server({
                    locatin: "Server->System->Account->Class playerIdGame->PlayerObjectFromGameid()",
                    message: error
                })
            }
        }
    };
    /**
     * set game id for player 
     * @param {string} from Enter the server rp || rpg 
     * @param {object} player altv player object 
     * @returns New Game Id
     */
    static async set(from, player) {
        try {
            for (let i = 1; i < process.env.Max_PLAYER; i++) {
                if (Idx[from][i] == undefined) {
                    Idx[from][i] = player.id
                    player.setSyncedMeta("hasLogin", true)
                    player.setSyncedMeta("inServer", from)
                    return i;
                }
            }
        } catch (error) {
            await logger.addlog.server({
                locatin: "Server->System->Account->Class playerIdGame->set()",
                message: error
            })
        }
    };
    /**
     * delete player game id 
     * @param {object} player altv player object
     */
    static async delete(player) {
        try {
            let from = player.getSyncedMeta('inServer');
            for (let i = 0; i < process.env.Max_PLAYER; i++) {
                if (Idx[from][i] == player.id) {
                    delete Idx[from][i]
                }
            }
        } catch (error) {
            await logger.addlog.server({
                locatin: "Server->System->Account->Class playerIdGame->delete()",
                message: error
            })
        }
    };
}
export class FindPlayerAccount {
    static Name(value) {
        let id = (Object.entries(playersdata['rpg']).filter((v, index, ar) => v[1].pName.toLocaleLowerCase().match(value.toLocaleLowerCase()) != undefined))
        if (id.length == undefined) {
            return ["undefined", null]
        } else if (id.length == 1) {
            return ["finded", alt.Player.getByID(id[0][1].altvID)]
        }
        if (id[1] != undefined) {
            let data = []
            for (let i = 0; i < id.length; i++) {
                data.push({ id: id[i][1].gameID, name: id[i][1].pName })
            }
            return ["duplicate", data]
        }
    }
    static GameID(ID) {
        return alt.Player.getByID(Idx[player.getSyncedMeta('inServer')][ID])
    }
}

var reg = new RegExp('^[0-9]$');

export function FindPlayerForCMD(value) {
    if (reg.test(value)) {
        if (GetPlayerIdAltv(value) != undefined) {
            return FindPlayerAccount.GameID(value)
        } else {
            return undefined;
        }
    } else {
        let f = findbyname(player, value)
        if (f[0] == undefined) {
            return undefined;
        } else if (f[0] == "duplicate") {
            sendchat(player, f[1])
            return undefined;
        } else {
            return f[1];
        }
    }
}


// metaSync:
// haslogin
// inServer