import * as alt from 'alt';
import { sql } from '../database/mysql';
import { redisDB } from '../database/redis';
import { Time } from '../utils/clock';
import { Language } from '../utils/dialogs';
import { PlayerData } from './account';
import { sendchat } from './chat';
import { ServerSetting } from './server_settings';
import './admin_CMD'
import './staff_CMD'

let SarONs = [],
    interval;


export class StaffSystem {
    //admin
    static async IsAdmin(player) {
        let PlayerInServer = await player.getSyncedMeta('inServer');
        return await PlayerData.get(PlayerInServer, player, "pAdmin") >= 1 ? true : false;
    }
    static async CheckAdmin(player, level) {
        let PlayerInServer = await player.getSyncedMeta('inServer');
        return await PlayerData.get(PlayerInServer, player, "pAdmin") >= level ? true : false;
    }
    static CheckObject = {
        MakeAdmin: async (player) => {
            let PlayerInServer = await player.getSyncedMeta('inServer');
            return await PlayerData.get(PlayerInServer, player, "pMakeAdmin") >= level ? true : false;
        }
    }
    static async IsHelper(player) {
        let PlayerInServer = await player.getSyncedMeta('inServer');
        return await PlayerData.get(PlayerInServer, player, "pHelper") >= 1 ? true : false;
    }
    static async CheckHelper(player, level) {
        let PlayerInServer = await player.getSyncedMeta('inServer');
        return await PlayerData.get(PlayerInServer, player, "pHelper") >= level ? true : false;
    }
    static async IsLeader(player) {
        let PlayerInServer = await player.getSyncedMeta('inServer');
        return await PlayerData.get(PlayerInServer, player, "pLeader") >= 1 ? true : false;
    }
    static async CheckLeader(player, level) {
        let PlayerInServer = await player.getSyncedMeta('inServer');
        return await PlayerData.get(PlayerInServer, player, "pLeader") >= level ? true : false;
    }
    static async Send_NotAdmin(player) {
        sendchat(player, await Language.GetValue(player.getSyncedMeta('Language'), "YOU_ARE_NOT_ADMIN"))
    }
    static async Send_Auth(player) {
        sendchat(player, await Language.GetValue(await player.getSyncedMeta('Language'), "YOU_DO_NOT_HAVE_SUFFICIENT_ACCESS_TO_DO_THIS"))
    }
    static async IsStaff(player) {
        if (await StaffSystem.IsAdmin(player) || await StaffSystem.IsHelper(player) || await StaffSystem.IsLeader(player)) {
            return true
        } else {
            return false
        }
    }
    static AdminBot = {
        SendChatToPlayer: (player, msg) => {
            sendchat(player, `AdminBot: ${msg}`)
        },
        SendChatToAdmins: (INTO, msg) => {
            let allPlayers = alt.Player.all
            for (let i = 0; i < allPlayers.length; i++) {
                if (!StaffSystem.IsLeader(allPlayers[i])) continue
                if (allPlayers[i].getSyncedMeta('inServer') == INTO) {
                    sendchat(player, `AdminBot: ${msg}`)
                }
            }
        },
        SendChatToHelpers: (INTO, msg) => {
            let allPlayers = alt.Player.all
            for (let i = 0; i < allPlayers.length; i++) {
                if (!StaffSystem.IsHelper(allPlayers[i])) continue
                if (allPlayers[i].getSyncedMeta('inServer') == INTO) {
                    sendchat(player, `AdminBot: ${msg}`)
                }
            }
        },
        SendChatToAdmins: (INTO, msg) => {
            let allPlayers = alt.Player.all
            for (let i = 0; i < allPlayers.length; i++) {
                if (!StaffSystem.IsAdmin(allPlayers[i])) continue
                if (allPlayers[i].getSyncedMeta('inServer') == INTO) {
                    sendchat(player, `AdminBot: ${msg}`)
                }
            }
        },
        SendChatToAdmins: (INTO, msg) => {
            let allPlayers = alt.Player.all
            for (let i = 0; i < allPlayers.length; i++) {
                if (!StaffSystem.IsStaff(allPlayers[i])) continue
                if (allPlayers[i].getSyncedMeta('inServer') == INTO) {
                    sendchat(player, `AdminBot: ${msg}`)
                }
            }
        }
    }
}

export class StaffPoint {
    static async sarON(player) {
        let PlayerInServer = player.getSyncedMeta('inServer')
        await sql('log', `INSERT INTO staff_log(Referral_ID, timestamp, inServer, department, value) VALUES ("${await PlayerData.get(PlayerInServer, player, 'pId')}","${Date.now()}","${PlayerInServer}","SAR",'${JSON.stringify({ status: true })}')`)
        player.setSyncedMeta('sar', true)
        SarONs.push(player)
    }
    static async sarOFF(player) {
        var index = SarONs.indexOf(player);
        if (index != -1) SarONs.splice(index, 1)
        let PlayerInServer = await player.getSyncedMeta('inServer')
        player.setSyncedMeta('sar', false)
        await sql('log', `INSERT INTO staff_log(Referral_ID, timestamp, inServer, department, value) VALUES ("${await PlayerData.get(PlayerInServer, player, 'pId')}","${Date.now()}","${PlayerInServer}","SAR",'${JSON.stringify({ status: false })}')`)
    }
    static async updateDate() {
        clearInterval(interval)
        this.CreateInterval(await Time.GetNameDay())
    }
    static async CreateInterval(NowNameDay) {
        interval = setInterval(async () => {
            SarONs.filter(async (player, i) => {
                let PlayerInServer = await player.getSyncedMeta('inServer')
                let playerstaff = await JSON.parse(await PlayerData.get(PlayerInServer, player, 'pStaff_Point'))
                playerstaff.week[NowNameDay] += 1000;
                playerstaff.alltime += 1000;
                await PlayerData.set(PlayerInServer, player, 'pStaff_Point', JSON.stringify(playerstaff), false)
            })
        }, 1000)
    }
    static async LoodAllStaff() {
        let rp = 0,
            rpg = 0;
        let AllStaff = await sql('main', `select * from Staff`)
        // redisDB.set('AllStaff', AllStaff)
        for (let i = 0; i < AllStaff.length; i++) {
            if (AllStaff[i].rp == true) {
                rp++
            } else if (AllStaff[i].rpg == true) {
                rpg++
            }
        }
        setTimeout(() => {
            console.log(`${"\x1b[94m"}RPG: ${"\x1b[31m"}${AllStaff.length}${"\x1b[32m"} Staff has been Loaded.${"\x1b[37m"}`)
            console.log(`${"\x1b[94m"}RP: ${"\x1b[31m"}${AllStaff.length}${"\x1b[32m"} Staff has been Loaded.${"\x1b[37m"}`)
        }, 10000);
    }
    static async SyncToDB() {
        let allPlayers = alt.Player.all
        for (let i = 0; i < allPlayers.length; i++) {
            if (await allPlayers[i].getSyncedMeta('hasLogin') == false) continue
            if (!await StaffSystem.IsStaff(allPlayers[i])) continue
            if (await allPlayers[i].getSyncedMeta('inServer') == "rp") {
                await PlayerData.set('rp', allPlayers[i], 'pStaff_Point', await PlayerData.get('rp', allPlayers[i], 'pStaff_Point'), true)
            }
            if (await allPlayers[i].getSyncedMeta('inServer') == "rpg") {
                await PlayerData.set('rpg', allPlayers[i], 'pStaff_Point', await PlayerData.get('rpg', allPlayers[i], 'pStaff_Point'), true)
            }
        }
    }
    static async calculatorSP(player) {
        let PlayerInServer = player.getSyncedMeta('inServer')
        let Sp = JSON.parse(PlayerData.get(PlayerInServer, 'pStaff_Point')).staff_point
        if (Sp < ServerSetting.get('lowestSpHelper_1') && StaffSystem.IsHelper(player)) {
            //helper 1
            if (StaffSystem.CheckHelper(player, 2)) {
                return PlayerData.set(PlayerInServer, 'pHelper', 1, true);
            } else {
                if (!StaffSystem.CheckHelper(player, 1)) {
                    return PlayerData.set(PlayerInServer, 'pHelper', 1, true);
                }
            }
        } else if (Sp < ServerSetting.get('lowestSpHelper_2') && StaffSystem.IsHelper(player)) {
            //helper 2
            if (StaffSystem.CheckHelper(player, 3)) {
                return PlayerData.set(PlayerInServer, 'pHelper', 2, true);
            } else {
                if (!StaffSystem.CheckHelper(player, 2)) {
                    return PlayerData.set(PlayerInServer, 'pHelper', 2, true);
                }
            }
        } else if (Sp < ServerSetting.get('lowestSpHelper_3') && (StaffSystem.IsHelper(player) || StaffSystem.IsAdmin(player))) {
            //helper 3
            if (StaffSystem.IsAdmin(player)) {
                if (Sp < (ServerSetting.get('lowestSpAdmin_1') - 10)) {
                    PlayerData.set(PlayerInServer, 'pHelper', 3, true);
                    return PlayerData.set(PlayerInServer, 'pAdmin', 0, true);
                }
            } else {
                if (!StaffSystem.CheckHelper(player, 3)) {
                    return PlayerData.set(PlayerInServer, 'pHelper', 3, true);
                }
            }
        } else if (Sp > ServerSetting.get('lowestSpAdmin_1')) {
            //admin 1
            if (StaffSystem.IsAdmin(player)) {
                if (Sp > (ServerSetting.get('lowestSpAdmin_2') - 10) && StaffSystem.CheckAdmin(player, 2)) {
                    return PlayerData.set(PlayerInServer, 'pAdmin', 1, true);
                }
            } else {
                if (PlayerData.get(PlayerInServer, 'pCanAdmin') == true) {
                    if (StaffSystem.IsHelper(player)) {
                        PlayerData.set(PlayerInServer, 'pHelper', 0, true);
                    }
                    if (StaffSystem.IsLeader(player)) {
                        PlayerData.set(PlayerInServer, 'pLeader', 0, true);
                    }
                    return PlayerData.set(PlayerInServer, 'pAdmin', 1, true);
                }
            }
        } else if (Sp > ServerSetting.get('lowestSpAdmin_2')) {
            //admin 2
            if (StaffSystem.IsAdmin(player)) {
                if (Sp > (ServerSetting.get('lowestSpAdmin_3') - 10) && StaffSystem.CheckAdmin(player, 3)) {
                    return PlayerData.set(PlayerInServer, 'pAdmin', 2, true);
                }
            } else {
                if (PlayerData.get(PlayerInServer, 'pCanAdmin') == true) {
                    if (StaffSystem.IsHelper(player)) {
                        PlayerData.set(PlayerInServer, 'pHelper', 0, true);
                    }
                    if (StaffSystem.IsLeader(player)) {
                        PlayerData.set(PlayerInServer, 'pLeader', 0, true);
                    }
                    return PlayerData.set(PlayerInServer, 'pAdmin', 2, true);
                }
            }
        } else if (Sp > ServerSetting.get('lowestSpAdmin_3')) {
            //admin 3
            if (StaffSystem.IsAdmin(player)) {
                if (Sp < (ServerSetting.get('lowestSpAdmin_4') - 10) && StaffSystem.CheckAdmin(player, 4)) {
                    return PlayerData.set(PlayerInServer, 'pAdmin', 3, true);
                }
            } else {
                if (PlayerData.get(PlayerInServer, 'pCanAdmin') == true) {
                    if (StaffSystem.IsHelper(player)) {
                        PlayerData.set(PlayerInServer, 'pHelper', 0, true);
                    }
                    if (StaffSystem.IsLeader(player)) {
                        PlayerData.set(PlayerInServer, 'pLeader', 0, true);
                    }
                    return PlayerData.set(PlayerInServer, 'pAdmin', 3, true);
                }
            }
        } else if (Sp > ServerSetting.get('lowestSpAdmin_4')) {
            //admin 4
            if (StaffSystem.IsAdmin(player)) {
                if (Sp > (ServerSetting.get('lowestSpAdmin_5') - 10) && StaffSystem.CheckAdmin(player, 5)) {
                    return PlayerData.set(PlayerInServer, 'pAdmin', 4, true);
                }
            } else {
                if (PlayerData.get(PlayerInServer, 'pCanAdmin') == true) {
                    if (StaffSystem.IsHelper(player)) {
                        PlayerData.set(PlayerInServer, 'pHelper', 0, true);
                    }
                    if (StaffSystem.IsLeader(player)) {
                        PlayerData.set(PlayerInServer, 'pLeader', 0, true);
                    }
                    return PlayerData.set(PlayerInServer, 'pAdmin', 4, true);
                }
            }
        } else if (Sp > ServerSetting.get('lowestSpAdmin_5')) {
            //admin 5
            if (PlayerData.get(PlayerInServer, 'pCanAdmin') == true) {
                if (StaffSystem.IsHelper(player)) {
                    PlayerData.set(PlayerInServer, 'pHelper', 0, true);
                }
                if (StaffSystem.IsLeader(player)) {
                    PlayerData.set(PlayerInServer, 'pLeader', 0, true);
                }
                return PlayerData.set(PlayerInServer, 'pAdmin', 5, true);
            }
        }
    }
}

StaffPoint.LoodAllStaff()
StaffPoint.CreateInterval(await Time.GetNameDay())