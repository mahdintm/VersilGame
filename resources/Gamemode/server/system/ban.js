import { sql } from "../database/mysql"
import { PlayerData } from "./account"

let bans = {
    hwban: [],
    licenseban: [],
    Accountban: [],
    Ipban: []
}

export class Ban {
    static load = async () => {
        let data = await sql(`select * from Hw_Ban`)
        if (data.length > 0) {
            data.forEach(element => {
                bans.hwban.push(element)
            });
        } else {
            if (data != '') {
                bans.hwban.push(data)
            }
        }
    }
    static hwban = {
        new: async (player, admin, reason, expire, Is_permanet = false, Is_Accounts = false) => {
            let data = await sql(`insert into Hw_Ban (Admin_id, Hwid, inTime, Expire, Is_permanet, Is_Accounts,Reason) values ("${await PlayerData.get(admin, 'pId')}","${player.hwidHash}","${Date.now()}","${expire}","${Is_permanet}","${Is_Accounts}","${reason}")`)
            return bans.hwban.push({
                id: data.insertId,
                Admin_id: await PlayerData.get(admin, 'pId'),
                Hwid: player.hwidHash,
                inTime: Date.now(),
                Expire: expire,
                Is_permanet: parseInt(Is_permanet),
                Is_Accounts: parseInt(Is_Accounts),
                Reason: reason
            })
        },
        check: async (hwid) => {
            for await (const index of bans.hwban) {
                if (index.Hwid == hwid) {
                    if (index.Expire < Date.now()) {
                        await Ban.hwban.remove(hwid)
                        return false
                    } else {
                        return index
                    }
                }
            }
            return false
        },
        remove: async (hwid) => {
            for (let i = 0; i < bans.hwban.length; i++) {
                if (bans.hwban[i]['Hwid'] == hwid) {
                    await sql(`DELETE FROM Hw_Ban WHERE id="${bans.hwban[i]['id']}"`)
                    bans.hwban.splice(i, 1)
                }
            }
        }
    }
}

Ban.load()
