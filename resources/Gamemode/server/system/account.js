import { sql } from "../database/mysql";
import * as alt from 'alt'
import { logger } from "./logger";
import { hashing } from "../utils/hash";
import { DiscordHook } from "../utils/discord-hook";
import { sendchat } from "./chat";
import { VirtualWorld } from "./virtual_world";
import { Business } from "./business";
import { Language } from "../utils/dialogs";
var playersdata = {}
var Idx = {}
export class PlayerData {
    static async register(player, obj, Discordid = player.getSyncedMeta('Discordid')) {
        try {
            let dataMain = await sql(`INSERT INTO Account(pName, pPassword, pPhonenumber, pEmail, pDiscord, pSex, pFirstName, pLastName, pNotificationEmail, pNotificationPhone, pBrithday, pLastLogin, pCreateAt) VALUES("${(obj.main.Username).toLowerCase()}", "${await hashing.sjcl.ConvertToHash(obj.main.Password)}", "${obj.main.Phone}", "${obj.main.Email}", "${Discordid}", "${obj.main.RealSex}", "${obj.main.RealFirstName.charAt(0).toUpperCase() + obj.main.RealFirstName.slice(1)}", "${obj.main.RealLastName.charAt(0).toUpperCase() + obj.main.RealLastName.slice(1)}", "${obj.main.SendNotificationToEmail ? 1 : 0}", "${obj.main.SendNotificationToPhone ? 1 : 0}", "${obj.main.RealDateOfBirth}", "0", "${Date.now()}")`)
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
            // await sql('log', `INSERT INTO register_log(rId, loginas, ip, timestamp, hwid, discordid, license) VALUES ("${dataMain.insertId}","Server","${(player.ip).substr(7, 24)}","${Date.now()}","${player.hwidHash}","${player.getSyncedMeta('Discordid')}","${player.socialID}")`);
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
            let DaTa = await sql(`select * FROM Account WHERE pName = "${(obj.username).toLowerCase()}"`);
            if (await hashing.sjcl.verify(obj.password, DaTa.pPassword) != true)
                return alt.emitClient(player, 'CallBack_Login_Account_To_Server', false);
            if (DaTa.pOnline == 1)
                return console.log("online");
            //settingup Data
            let time = Date.now();
            await sql(`update Account set pOnline="${1}",pLastLogin="${time}" WHERE pId="${DaTa.pId}"`)
            alt.emitClient(player, 'CallBack_Login_Account_To_Server', true);
            playersdata[player.id] = DaTa;
            playersdata[player.id]['pName'] = obj.username;
            playersdata[player.id]['gameID'] = await playerIdGame.set(player);
            await player.spawn(-66.84395599365234, -802.20615234375, 44.2255859375);
            await VirtualWorld.set(player, 0)
            await Business.Load_To_Players(player)
            player.setSyncedMeta("hasLogin", true);
            //log system
            // await sql(`INSERT INTO login_log(rId, loginas, ip, timestamp, hwid, discordid, license) VALUES ("${DaTa.rId}","Server","${(player.ip).substr(7, 24)}","${time}","${player.hwidHash}","${player.getSyncedMeta('Discordid')}","${player.socialID}")`);
            DiscordHook.newhook.login({ username: obj.username, sqlid: DaTa.pId, hwid: player.hwidHash, discordid: player.getSyncedMeta('Discordid'), ip: (player.ip).substr(7, 24), license: player.socialID });
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
     * @param {Object} player altv player object
     * @param {String} DataName data name
     */
    static async get(player, DataName) {
        try {
            return await playersdata[player.id][DataName]
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
    static async set(player, DataName, value, sync_sql = false) {
        try {
            playersdata[player.id][DataName] = value;
            if (sync_sql) await sql(`UPDATE Account SET ${DataName} = '${value}' WHERE pId = "${await PlayerData.get(player, "pId")}"`);
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
            delete playersdata[player.id]
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
                    if (Idx[i] == player.id) {
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
         * @param {number} enterdid enter the idgame 
         * @returns altv player object
         */
        async PlayerObjectFromGameid(enterdid) {
            try {
                return alt.players.getByID(Idx[enterdid]);
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
     * @param {object} player altv player object 
     * @returns New Game Id
     */
    static async set(player) {
        try {
            for (let i = 1; i < process.env.Max_PLAYER; i++) {
                if (Idx[i] == undefined) {
                    Idx[i] = player.id
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
            for (let i = 0; i < process.env.Max_PLAYER; i++) {
                if (Idx[i] == player.id) {
                    delete Idx[i]
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
        let id = (Object.entries(playersdata).filter((v, index, ar) => v[1].pName.toLowerCase().match(value.toLowerCase()) != undefined))
        if (id.length == undefined) {
            return ["undefined", null]
        } else if (id.length == 1) {
            return ["finded", alt.Player.getByID(id[0][1].altvID)]
        } else if (id.length > 1 && id.length <= 6) {
            let data = []
            for (let i = 0; i < id.length; i++) {
                data.push({ id: id[i][1].gameID, name: id[i][1].pName })
            }
            return ["duplicate", data]
        } else {
            return ['duplicate_Highest']
        }
    }
    static GameID(ID) {
        return alt.Player.getByID(Idx[player.getSyncedMeta('inServer')][ID])
    }

    static async FromReferral(id) {
        let ID = (Object.entries(playersdata).filter((v, index, ar) => v[1].pId == id))
        return ID.length > 0 ? ID[0][0] : undefined
    }
}

var reg = new RegExp('^[0-9]$');

export async function FindPlayerForCMD(player, value) {
    if (reg.test(value)) {
        if (GetPlayerIdAltv(value) != undefined) {
            return FindPlayerAccount.GameID(value)
        } else {
            return undefined;
        }
    } else {
        let f = FindPlayerAccount.Name(value)
        if (f[0] == undefined) {
            return undefined;
        } else if (f[0] == "duplicate") {
            var text = "";
            for (let i = 0; i < f[1].length; i++) {
                text = text + `Id: ${f[1][i].id} Name: ${f[1][i].pName} \n`
            }
            sendchat(player, text)
            return undefined;
        } else if (f[0] == "duplicate_Highest") {
            sendchat(player, await Language.GetValue(player.getSyncedMeta('Language'), "PLAYER_IS_OFFLINE", [value]))
            return undefined;
        } else {
            return f[1];
        }
    }
}
// console.log(await FindPlayerAccount.FromReferral(1002))




// metaSync:
// haslogin
// inServer