import * as alt from 'alt';
import { sql } from '../database/mysql';
import { Time } from '../utils/clock';
import { Language } from '../utils/dialogs';
import { PlayerData } from './account';
import { sendchat } from './chat';
import { ServerSetting } from './server_settings';
import './CMD_Admin'
import './CMD_Staff'

let SarONs = [],
    interval;


export class StaffSystem {
    //admin
    static async IsAdmin(player) {
        return await PlayerData.get(player, "pAdmin") >= 1 ? true : false;
    }
    static async CheckAdmin(player, level) {
        return await PlayerData.get(player, "pAdmin") >= level ? true : false;
    }
    static CheckObject = {
        MakeAdmin: async (player) => {
            return await PlayerData.get(player, "pMakeAdmin") >= level ? true : false;
        }
    }
    static async IsHelper(player) {
        return await PlayerData.get(player, "pHelper") >= 1 ? true : false;
    }
    static async CheckHelper(player, level) {
        return await PlayerData.get(player, "pHelper") >= level ? true : false;
    }
    static async IsLeader(player) {
        return await PlayerData.get(player, "pLeader") >= 1 ? true : false;
    }
    static async CheckLeader(player, level) {
        return await PlayerData.get(player, "pLeader") >= level ? true : false;
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
        SendChatToAdmins: (msg) => {
            let allPlayers = alt.Player.all
            for (let i = 0; i < allPlayers.length; i++) {
                if (!StaffSystem.IsLeader(allPlayers[i])) continue
                sendchat(player, `AdminBot: ${msg}`)
            }
        },
        SendChatToHelpers: (msg) => {
            let allPlayers = alt.Player.all
            for (let i = 0; i < allPlayers.length; i++) {
                if (!StaffSystem.IsHelper(allPlayers[i])) continue
                sendchat(player, `AdminBot: ${msg}`)
            }
        },
        SendChatToLeaders: (msg) => {
            let allPlayers = alt.Player.all
            for (let i = 0; i < allPlayers.length; i++) {
                if (!StaffSystem.IsLeader(allPlayers[i])) continue
                sendchat(player, `AdminBot: ${msg}`)
            }
        },
        SendChatToAdmins: (msg) => {
            let allPlayers = alt.Player.all
            for (let i = 0; i < allPlayers.length; i++) {
                if (!StaffSystem.IsStaff(allPlayers[i])) continue
                sendchat(player, `AdminBot: ${msg}`)
            }
        }
    }
}

export class StaffPoint {
    static async sarON(player) {
        // await sql('log', `INSERT INTO staff_log(Referral_ID, timestamp, inServer, department, value) VALUES ("${await PlayerData.get(player, 'pId')}","${Date.now()}","SAR",'${JSON.stringify({ status: true })}')`)
        player.setSyncedMeta('sar', true)
        SarONs.push(player)
    }
    static async sarOFF(player) {
        var index = SarONs.indexOf(player);
        if (index != -1) SarONs.splice(index, 1)
        player.setSyncedMeta('sar', false)
        // await sql('log', `INSERT INTO staff_log(Referral_ID, timestamp, inServer, department, value) VALUES ("${await PlayerData.get(player, 'pId')}","${Date.now()}","SAR",'${JSON.stringify({ status: false })}')`)
    }
    static async updateDate() {
        clearInterval(interval)
        this.CreateInterval(await Time.GetNameDay())
    }
    static async CreateInterval(NowNameDay) {
        interval = setInterval(async () => {
            SarONs.filter(async (player, i) => {
                let playerstaff = await JSON.parse(await PlayerData.get(player, 'pStaff_Point'))
                playerstaff.week[NowNameDay] += 1000;
                playerstaff.alltime += 1000;
                await PlayerData.set(player, 'pStaff_Point', JSON.stringify(playerstaff), false)
            })
        }, 1000)
    }
    static async SyncToDB() {
        let allPlayers = alt.Player.all
        for (let i = 0; i < allPlayers.length; i++) {
            if (await allPlayers[i].getSyncedMeta('hasLogin') == false) continue
            if (!await StaffSystem.IsStaff(allPlayers[i])) continue
            await PlayerData.set(allPlayers[i], 'pStaff_Point', await PlayerData.get(allPlayers[i], 'pStaff_Point'), true)
        }
    }
    static async calculatorSP(player) {
        let Sp = JSON.parse(PlayerData.get('pStaff_Point')).staff_point
        if (Sp < ServerSetting.get('lowestSpHelper_1') && StaffSystem.IsHelper(player)) {
            //helper 1
            if (StaffSystem.CheckHelper(player, 2)) {
                return PlayerData.set('pHelper', 1, true);
            } else {
                if (!StaffSystem.CheckHelper(player, 1)) {
                    return PlayerData.set('pHelper', 1, true);
                }
            }
        } else if (Sp < ServerSetting.get('lowestSpHelper_2') && StaffSystem.IsHelper(player)) {
            //helper 2
            if (StaffSystem.CheckHelper(player, 3)) {
                return PlayerData.set('pHelper', 2, true);
            } else {
                if (!StaffSystem.CheckHelper(player, 2)) {
                    return PlayerData.set('pHelper', 2, true);
                }
            }
        } else if (Sp < ServerSetting.get('lowestSpHelper_3') && (StaffSystem.IsHelper(player) || StaffSystem.IsAdmin(player))) {
            //helper 3
            if (StaffSystem.IsAdmin(player)) {
                if (Sp < (ServerSetting.get('lowestSpAdmin_1') - 10)) {
                    PlayerData.set('pHelper', 3, true);
                    return PlayerData.set('pAdmin', 0, true);
                }
            } else {
                if (!StaffSystem.CheckHelper(player, 3)) {
                    return PlayerData.set('pHelper', 3, true);
                }
            }
        } else if (Sp > ServerSetting.get('lowestSpAdmin_1')) {
            //admin 1
            if (StaffSystem.IsAdmin(player)) {
                if (Sp > (ServerSetting.get('lowestSpAdmin_2') - 10) && StaffSystem.CheckAdmin(player, 2)) {
                    return PlayerData.set('pAdmin', 1, true);
                }
            } else {
                if (PlayerData.get('pCanAdmin') == true) {
                    if (StaffSystem.IsHelper(player)) {
                        PlayerData.set('pHelper', 0, true);
                    }
                    if (StaffSystem.IsLeader(player)) {
                        PlayerData.set('pLeader', 0, true);
                    }
                    return PlayerData.set('pAdmin', 1, true);
                }
            }
        } else if (Sp > ServerSetting.get('lowestSpAdmin_2')) {
            //admin 2
            if (StaffSystem.IsAdmin(player)) {
                if (Sp > (ServerSetting.get('lowestSpAdmin_3') - 10) && StaffSystem.CheckAdmin(player, 3)) {
                    return PlayerData.set('pAdmin', 2, true);
                }
            } else {
                if (PlayerData.get('pCanAdmin') == true) {
                    if (StaffSystem.IsHelper(player)) {
                        PlayerData.set('pHelper', 0, true);
                    }
                    if (StaffSystem.IsLeader(player)) {
                        PlayerData.set('pLeader', 0, true);
                    }
                    return PlayerData.set('pAdmin', 2, true);
                }
            }
        } else if (Sp > ServerSetting.get('lowestSpAdmin_3')) {
            //admin 3
            if (StaffSystem.IsAdmin(player)) {
                if (Sp < (ServerSetting.get('lowestSpAdmin_4') - 10) && StaffSystem.CheckAdmin(player, 4)) {
                    return PlayerData.set('pAdmin', 3, true);
                }
            } else {
                if (PlayerData.get('pCanAdmin') == true) {
                    if (StaffSystem.IsHelper(player)) {
                        PlayerData.set('pHelper', 0, true);
                    }
                    if (StaffSystem.IsLeader(player)) {
                        PlayerData.set('pLeader', 0, true);
                    }
                    return PlayerData.set('pAdmin', 3, true);
                }
            }
        } else if (Sp > ServerSetting.get('lowestSpAdmin_4')) {
            //admin 4
            if (StaffSystem.IsAdmin(player)) {
                if (Sp > (ServerSetting.get('lowestSpAdmin_5') - 10) && StaffSystem.CheckAdmin(player, 5)) {
                    return PlayerData.set('pAdmin', 4, true);
                }
            } else {
                if (PlayerData.get('pCanAdmin') == true) {
                    if (StaffSystem.IsHelper(player)) {
                        PlayerData.set('pHelper', 0, true);
                    }
                    if (StaffSystem.IsLeader(player)) {
                        PlayerData.set('pLeader', 0, true);
                    }
                    return PlayerData.set('pAdmin', 4, true);
                }
            }
        } else if (Sp > ServerSetting.get('lowestSpAdmin_5')) {
            //admin 5
            if (PlayerData.get('pCanAdmin') == true) {
                if (StaffSystem.IsHelper(player)) {
                    PlayerData.set('pHelper', 0, true);
                }
                if (StaffSystem.IsLeader(player)) {
                    PlayerData.set('pLeader', 0, true);
                }
                return PlayerData.set('pAdmin', 5, true);
            }
        }
    }
}

// StaffPoint.LoodAllStaff()
StaffPoint.CreateInterval(await Time.GetNameDay())