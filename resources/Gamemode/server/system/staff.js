import * as alt from 'alt';
import { sql } from '../database/mysql';
import { Time } from '../utils/clock';
import { Language } from '../utils/dialogs';
import { FindPlayerAccount, PlayerData } from './account';
import { sendchat } from './chat';
import { ServerSetting } from './server_settings';
import './CMD_Admin'
import './CMD_Staff'
import { Colors } from '../utils/colors';
import { Hoster } from './hoster';
import { DiscordHook } from '../utils/discord-hook';

let SarONs = [],
    interval,
    Admin_Commands = {};

export class StaffSystem {
    static CMD = {
        Level: {
            check: async (player, FunctionName) => {
                if (await StaffSystem.IsAdmin(player)) {
                    return await StaffSystem.CheckAdmin(player, Admin_Commands[FunctionName]['aLevel'])
                } else if (await StaffSystem.IsHelper(player)) {
                    return await StaffSystem.CheckHelper(player, Admin_Commands[FunctionName]['hLevel'])
                } else if (await StaffSystem.IsLeader(player)) {
                    return await StaffSystem.CheckLeader(player, Admin_Commands[FunctionName]['lLevel'])
                } else if (await Hoster.IsHoster(player)) {
                    return await Hoster.CheckHoster(player, Admin_Commands[FunctionName]['hoLevel'])
                } else {
                    return false
                }
            },
            get: async (FunctionName, from) => {
                switch (from) {
                    case "Admin":
                        return Admin_Commands[FunctionName]["aLevel"]
                    case "Helper":
                        return Admin_Commands[FunctionName]["hLevel"]
                    case "Leader":
                        return Admin_Commands[FunctionName]["lLevel"]
                    default:
                        break;
                }
            },
            set: (FunctionName, from, Level) => {
                switch (from) {
                    case "Admin":
                        return Admin_Commands[FunctionName]["aLevel"] = Level
                    case "Helper":
                        return Admin_Commands[FunctionName]["hLevel"] = Level
                    case "Leader":
                        return Admin_Commands[FunctionName]["lLevel"] = Level
                    default:
                        break;
                }
            }
        },
        Load: async () => {
            let data = await sql(`Select * from AdminCommands`)
            await data.forEach(async element => {
                Admin_Commands[element.name] = element
            });
        }
    }
    //admin
    static async IsAdmin(player) {
        return await PlayerData.get(player, "pAdmin") >= 1 ? true : false;
    }
    static async CheckAdmin(player, level) {
        return await PlayerData.get(player, "pAdmin") >= level ? true : false;
    }
    static CheckObject = {
        MakeAdmin: async (player) => {
            return await PlayerData.get(player, "pMakeAdmin") == true ? true : false;
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
    static Warn = {
        Player: (player, msg) => {
            sendchat(player, `AdminBot: ${msg}`)
        },
        Admins: async (Key, arr) => {
            let allPlayers = alt.Player.all
            for (let i = 0; i < allPlayers.length; i++) {
                if (!StaffSystem.IsAdmin(allPlayers[i])) continue
                sendchat(allPlayers[i], `{${await Colors.chat.AdminWarn}}` + await Language.GetValue(allPlayers[i].getSyncedMeta('Language'), "CHAT_ADMIN_WARN") + `{${Colors.chat.Default}} ` + await Language.GetValue(allPlayers[i].getSyncedMeta('Language'), Key, arr))
                await DiscordHook.newhook.adminwarn(await Language.GetValue(allPlayers[i].getSyncedMeta('Language'), Key, arr))
            }
        },
        Helpers: async (msg) => {
            let allPlayers = alt.Player.all
            for (let i = 0; i < allPlayers.length; i++) {
                if (!StaffSystem.IsHelper(allPlayers[i])) continue
                sendchat(
                    allPlayers[i],
                    `{${await Colors.chat.HelperWarn}}` +
                    await Language.GetValue(allPlayers[i].getSyncedMeta('Language'), "CHAT_HELPER_WARN") +
                    `{${Colors.chat.Default}} ` +
                    msg
                )
            }
        },
        Leaders: async (msg) => {
            let allPlayers = alt.Player.all
            for (let i = 0; i < allPlayers.length; i++) {
                if (!StaffSystem.IsLeader(allPlayers[i])) continue
                sendchat(
                    allPlayers[i],
                    `{${await Colors.chat.LeaderWarn}}` +
                    await Language.GetValue(allPlayers[i].getSyncedMeta('Language'), "CHAT_LEADER_WARN") +
                    `{${Colors.chat.Default}} ` +
                    msg
                )
            }
        },
        Staff: async (msg) => {
            let allPlayers = alt.Player.all
            for (let i = 0; i < allPlayers.length; i++) {
                if (!StaffSystem.IsStaff(allPlayers[i])) continue
                sendchat(
                    allPlayers[i],
                    `{${await Colors.chat.StaffWarn}}` +
                    await Language.GetValue(allPlayers[i].getSyncedMeta('Language'), "CHAT_STAFF_WARN") +
                    `{${Colors.chat.Default}} ` +
                    msg
                )
            }
        }
    }
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
    static async CalculatorSPAll() {
        let datas = await sql('select pId,pAdmin , pHelper , pLeader , pStaff_Point ,pOnline from Account where pAdmin>0 or pHelper >0 or pLeader>0')
        if (datas.length != undefined) {
            datas.forEach(async data => {
                if (data.pOnline == 1) {
                    let playerid = await FindPlayerAccount.FromReferral(data.pId)
                    if (playerid)
                        this.CalculatorSP(await alt.Player.getByID(playerid))
                } else {
                    this.#CalculatorSP_DB(data)
                }
            });
        } else {
            if (datas.pOnline == 1) {
                let playerid = await FindPlayerAccount.FromReferral(datas.pId)
                if (playerid)
                    this.CalculatorSP(await alt.Player.getByID(playerid))
            } else {
                this.#CalculatorSP_DB(datas)
            }
        }
    }
    static async CalculatorSP(player) {
        let staffpoint = await PlayerData.get(player, 'pStaff_Point')
        let NowNameDay = await Time.GetNameDay()
        if (staffpoint.week[NowNameDay] >= 36000000)
            await StaffPoint.give(player, 4)
        else if (staffpoint.week[NowNameDay] >= 25200000)
            await StaffPoint.give(player, 3)
        else if (staffpoint.week[NowNameDay] >= 16200000)
            await StaffPoint.give(player, 2)
        else if (staffpoint.week[NowNameDay] >= 10800000)
            await StaffPoint.give(player, 1)
        else if (staffpoint.week[NowNameDay] < 5400000)
            await StaffPoint.take(player, 1)
    }
    static async #CalculatorSP_DB(data) {
        let staffpoint = JSON.parse(data.pStaff_Point);
        let NowNameDay = await Time.GetNameDay()
        if (staffpoint.week[NowNameDay] >= 36000000)
            staffpoint.staff_point += 4
        else if (staffpoint.week[NowNameDay] >= 25200000)
            staffpoint.staff_point += 3
        else if (staffpoint.week[NowNameDay] >= 16200000)
            staffpoint.staff_point += 2
        else if (staffpoint.week[NowNameDay] >= 10800000)
            staffpoint.staff_point += 1
        else if (staffpoint.week[NowNameDay] < 5400000)
            staffpoint.staff_point -= 1
        await sql(`update Account SET pStaff_Point="${JSON.stringify(staffpoint)}" where pId="${data.pId}"`);
    }
    static async CalculatorRoleAll() {
        let datas = await sql('select pId,pAdmin , pHelper , pLeader , pStaff_Point ,pOnline,pCanAdmin from Account where pAdmin>0 or pHelper >0 or pLeader>0')
        if (datas.length != undefined) {
            datas.forEach(async data => {
                if (data.pOnline == 1) {
                    let playerid = await FindPlayerAccount.FromReferral(data.pId)
                    if (playerid)
                        this.CalculatorRole(await alt.Player.getByID(playerid))
                } else {
                    this.#CalculatorRole_DB(data)
                }
            });
        } else {
            if (datas.pOnline == 1) {
                let playerid = await FindPlayerAccount.FromReferral(datas.pId)
                if (playerid)
                    this.CalculatorRole(await alt.Player.getByID(playerid))
            } else {
                this.#CalculatorRole_DB(datas)
            }
        }
    }
    static async #CalculatorRole_DB(data) {
        let Sp = JSON.parse(data.pStaff_Point).staff_point
        if (data.pAdmin >= 8) {
            return
        }
        if (Sp < await ServerSetting.get('lowestSpHelper_1')) {
            //demote
            return await sql(`update Account set pHelper="0",pLeader="0",pCanAdmin="0",pAdmin="0" where pId="${data.pId}"`)
        } else if ((Sp >= await ServerSetting.get('lowestSpHelper_1') && Sp < await ServerSetting.get('lowestSpHelper_2')) && !data.pLeader >= 1) {
            //helper 1
            return await sql(`update Account set pHelper="1",pAdmin="0",pCanAdmin="0" where pId="${data.pId}"`)
        } else if ((Sp >= await ServerSetting.get('lowestSpHelper_2') && Sp < await ServerSetting.get('lowestSpHelper_3')) && !data.pLeader >= 1) {
            return await sql(`update Account set pHelper="2",pAdmin="0",pCanAdmin="0" where pId="${data.pId}"`)
        } else if ((Sp >= await ServerSetting.get('lowestSpHelper_3') && Sp < await ServerSetting.get('lowestSpAdmin_1')) && !data.pLeader >= 1) {
            //helper 3
            if (data.pAdmin >= 1) {
                if (Sp < (await ServerSetting.get('lowestSpAdmin_1') - 10)) {
                    return await sql(`update Account set pHelper="3",pAdmin="0",pCanAdmin="0" where pId="${data.pId}"`)
                } else {
                    return await sql(`update Account setpAdmin="1" where pId="${data.pId}"`)
                }
            } else {
                return await sql(`update Account set pHelper="3",pAdmin="0",pCanAdmin="0" where pId="${data.pId}"`)
            }
        } else if ((Sp >= await ServerSetting.get('lowestSpAdmin_1') && Sp < await ServerSetting.get('lowestSpAdmin_2'))) {
            //admin 1
            if (data.pAdmin >= 1 && data.pCanAdmin) {
                if (Sp < (await ServerSetting.get('lowestSpAdmin_2') - 10)) {
                    return await sql(`update Account set pAdmin="1" where pId="${data.pId}"`)
                }
            } else {
                if (data.pCanAdmin) {
                    return await sql(`update Account set pAdmin="1",pLeader="0",pHelper="3" where pId="${data.pId}"`)
                }
                else {
                    return await sql(`update Account set pAdmin="0",pLeader="0",pHelper="3" where pId="${data.pId}"`)
                }
            }
        } else if ((Sp >= await ServerSetting.get('lowestSpAdmin_2') && Sp < await ServerSetting.get('lowestSpAdmin_3'))) {
            //admin 2
            if (data.pAdmin >= 1 && data.pCanAdmin) {
                if (Sp < (await ServerSetting.get('lowestSpAdmin_3') - 10)) {
                    return await sql(`update Account set pAdmin="2" where pId="${data.pId}"`)
                }
            } else {
                if (data.pCanAdmin)
                    return await sql(`update Account set pAdmin="2",pLeader="0",pHelper="3" where pId="${data.pId}"`)
                else
                    return await sql(`update Account set pAdmin="0",pLeader="0",pHelper="3" where pId="${data.pId}"`)
            }
        } else if ((Sp >= await ServerSetting.get('lowestSpAdmin_3') && Sp < await ServerSetting.get('lowestSpAdmin_4'))) {
            //admin 3
            if (data.pAdmin >= 1 && data.pCanAdmin) {
                if (Sp < (await ServerSetting.get('lowestSpAdmin_4') - 10)) {
                    return await sql(`update Account set pAdmin="3" where pId="${data.pId}"`)
                }
            } else {
                if (data.pCanAdmin)
                    return await sql(`update Account set pAdmin="3",pLeader="0",pHelper="3" where pId="${data.pId}"`)
                else
                    return await sql(`update Account set pAdmin="0",pLeader="0",pHelper="3" where pId="${data.pId}"`)
            }
        } else if ((Sp >= await ServerSetting.get('lowestSpAdmin_4') && Sp < await ServerSetting.get('lowestSpAdmin_5'))) {
            //admin 4
            if (data.pAdmin >= 1) {
                if (Sp < (await ServerSetting.get('lowestSpAdmin_5') - 10) && (data.pAdmin >= 5 && data.pAdmin <= 7)) {
                    return await sql(`update Account set pAdmin="4" where pId="${data.pId}"`)
                }
            }
        }

    }
    static async CalculatorRole(player) {
        let Sp = JSON.parse(await PlayerData.get(player, 'pStaff_Point')).staff_point
        if (await StaffSystem.CheckAdmin(player, 8) || await StaffSystem.CheckAdmin(player, 9) || await StaffSystem.CheckAdmin(player, 10)) {
            return
        }
        if (Sp < await ServerSetting.get('lowestSpHelper_1')) {
            //demote
            await PlayerData.set(player, 'pHelper', 0, true);
            await PlayerData.set(player, 'pLeader', 0, true);
            await PlayerData.set(player, 'pCanAdmin', 0, true);
            return await PlayerData.set(player, 'pAdmin', 0, true);
        } else if ((Sp >= await ServerSetting.get('lowestSpHelper_1') && Sp < await ServerSetting.get('lowestSpHelper_2')) && !await StaffSystem.IsLeader(player)) {
            //helper 1
            await PlayerData.set(player, 'pHelper', 1, true);
            await PlayerData.set(player, 'pCanAdmin', 0, true);
            return await PlayerData.set(player, 'pAdmin', 0, true);
        } else if ((Sp >= await ServerSetting.get('lowestSpHelper_2') && Sp < await ServerSetting.get('lowestSpHelper_3')) && !await StaffSystem.IsLeader(player)) {
            //helper 2
            await PlayerData.set(player, 'pCanAdmin', 0, true);
            await PlayerData.set(player, 'pAdmin', 0, true);
            return await PlayerData.set(player, 'pHelper', 2, true);
        } else if ((Sp >= await ServerSetting.get('lowestSpHelper_3') && Sp < await ServerSetting.get('lowestSpAdmin_1')) && !await StaffSystem.IsLeader(player)) {
            //helper 3
            if (await StaffSystem.IsAdmin(player)) {
                if (Sp < (await ServerSetting.get('lowestSpAdmin_1') - 10)) {
                    await PlayerData.set(player, 'pHelper', 3, true);
                    await PlayerData.set(player, 'pAdmin', 0, true);
                    return await PlayerData.set(player, 'pCanAdmin', 0, true)
                } else {
                    await PlayerData.set(player, 'pAdmin', 1, true);
                }
            } else {
                await PlayerData.set(player, 'pAdmin', 0, true);
                await PlayerData.set(player, 'pCanAdmin', 0, true)
                return await PlayerData.set(player, 'pHelper', 3, true);
            }
        } else if ((Sp >= await ServerSetting.get('lowestSpAdmin_1') && Sp < await ServerSetting.get('lowestSpAdmin_2'))) {
            //admin 1
            console.log(1)
            if (await StaffSystem.IsAdmin(player)) {
                console.log(2)

                if (Sp < (await ServerSetting.get('lowestSpAdmin_2') - 10)) {
                    console.log(3)

                    return await PlayerData.set(player, 'pAdmin', 1, true);
                }
            } else {
                console.log(4)

                this.#SetPlayerRoleWithCanAdmin(player, 1)
            }
        } else if ((Sp >= await ServerSetting.get('lowestSpAdmin_2') && Sp < await ServerSetting.get('lowestSpAdmin_3'))) {
            //admin 2
            if (await StaffSystem.IsAdmin(player)) {
                if (Sp < (await ServerSetting.get('lowestSpAdmin_3') - 10)) {
                    return await PlayerData.set(player, 'pAdmin', 2, true);
                }
            } else {
                this.#SetPlayerRoleWithCanAdmin(player, 2)
            }
        } else if ((Sp >= await ServerSetting.get('lowestSpAdmin_3') && Sp < await ServerSetting.get('lowestSpAdmin_4'))) {
            //admin 3
            if (await StaffSystem.IsAdmin(player)) {
                if (Sp < (await ServerSetting.get('lowestSpAdmin_4') - 10)) {
                    return await PlayerData.set(player, 'pAdmin', 3, true);
                }
            } else {
                this.#SetPlayerRoleWithCanAdmin(player, 3)
            }
        } else if ((Sp >= await ServerSetting.get('lowestSpAdmin_4') && Sp < await ServerSetting.get('lowestSpAdmin_5'))) {
            //admin 4
            if (await StaffSystem.IsAdmin(player)) {
                if (Sp < (await ServerSetting.get('lowestSpAdmin_5') - 10) && (await StaffSystem.CheckAdmin(player, 5) || await StaffSystem.CheckAdmin(player, 6) || await StaffSystem.CheckAdmin(player, 7))) {
                    return await PlayerData.set(player, 'pAdmin', 4, true);
                }
            }
        }
        // } else if (Sp >= await ServerSetting.get('lowestSpAdmin_5') && Sp < 700) {
        //     //admin 5
        //     if (await StaffSystem.IsAdmin(player) && (await StaffSystem.CheckAdmin(player, 6) || await StaffSystem.CheckAdmin(player, 7))) {
        //         return await PlayerData.set(player, 'pAdmin', 5, true);
        //     }
        // }
    }
    static async #SetPlayerRoleWithCanAdmin(player, AdminLevel) {
        if (await PlayerData.get(player, 'pCanAdmin') == true) {
            await PlayerData.set(player, 'pHelper', 3, true);
            await PlayerData.set(player, 'pLeader', 0, true);
            return await PlayerData.set(player, 'pAdmin', AdminLevel, true);
        } else {
            await PlayerData.set(player, 'pHelper', 3, true);
            await PlayerData.set(player, 'pLeader', 0, true);
            return await PlayerData.set(player, 'pAdmin', 0, true);
        }
    }
}
export class StaffPoint {
    static async set(player, amount) {
        let playerstaff = await JSON.parse(await PlayerData.get(player, 'pStaff_Point'))
        playerstaff.staff_point = parseInt(amount);
        await PlayerData.set(player, 'pStaff_Point', JSON.stringify(playerstaff), true)
    }
    static async give(player, amount) {
        let playerstaff = await JSON.parse(await PlayerData.get(player, 'pStaff_Point'))
        playerstaff.staff_point += parseInt(amount);
        await PlayerData.set(player, 'pStaff_Point', JSON.stringify(playerstaff), true)
    }
    static async get(player) {
        return JSON.parse(await PlayerData.get(player, 'pStaff_Point')).staff_point
    }
    static async take(player, amount) {
        let playerstaff = await JSON.parse(await PlayerData.get(player, 'pStaff_Point'))
        playerstaff.staff_point -= parseInt(amount);
        await PlayerData.set(player, 'pStaff_Point', JSON.stringify(playerstaff), true)
    }
}


StaffSystem.CMD.Load()
StaffSystem.CreateInterval(await Time.GetNameDay())

// StaffPoint.LoodAllStaff()
// StaffSystem.calculatorSP()