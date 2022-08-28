import { sql } from "../database/mysql";
import { Language } from "../utils/dialogs";
import { vehicleObject } from "../utils/VehicleList";
import { FindPlayerAccount, FindPlayerForCMD, PlayerData } from "./account";
import { Business } from "./business";
import { registerCmd, sendchat } from "./chat";
import { Money } from "./money";
import { StaffPoint, StaffSystem } from "./staff";
import { VehicleClass } from "./vehicles";

async function MakeAdmin(player, args) {
    if (!await StaffSystem.IsAdmin(player)) return await StaffSystem.Send_NotAdmin(player)
    if (!(await StaffSystem.CheckObject.MakeAdmin(player) && await StaffSystem.CMD.Level.check(player, 'MakeAdmin')))
        return await StaffSystem.Send_Auth(player)
    if (args[0] == undefined || args[1] == undefined)
        return sendchat(player, 'makeadmin(ma) [PlayerName/PlayerID] [AdminLevel]');
    let taraf = await FindPlayerForCMD(player, args[0])
    if (taraf == undefined) return
    //--------------------------------------------------
    await PlayerData.set(taraf, 'pAdmin', args[1], true)
    await StaffSystem.CalculatorRole(player)
    await StaffSystem.Warn.Admins("ADMIN_GIVED_ADMIN_TO_PLAYER2", [await PlayerData.get(player, 'pName'), args[1], await PlayerData.get(taraf, 'pName')])
    await sendchat(player, await Language.GetValue(player.getSyncedMeta('Language'), "YOU_GAVE_ADMIN_PLAYER2", [args[1], await PlayerData.get(taraf, 'pName')]))
    await sendchat(taraf, await Language.GetValue(taraf.getSyncedMeta('Language'), "ADMIN_GIVEN_ADMIN_YOU", [await PlayerData.get(player, 'pName'), args[1]]))

}
async function GiveStaffPoint(player, args) {
    if (!await StaffSystem.IsAdmin(player)) return await StaffSystem.Send_NotAdmin(player)
    if (!await StaffSystem.CMD.Level.check(player, 'GiveStaffPoint'))
        return await StaffSystem.Send_Auth(player)
    if (args[0] == undefined || args[1] == undefined)
        return sendchat(player, 'GiveStaffPoint(GiveSP) [PlayerName/PlayerID] [Amount]');
    let taraf = await FindPlayerForCMD(player, args[0])
    if (taraf == undefined) return
    //--------------------------------------------------
    await StaffPoint.give(taraf, parseInt(args[1]))
    await StaffSystem.CalculatorRole(player)
    await StaffSystem.Warn.Admins("ADMIN_GIVED_STAFFPOINT_TO_PLAYER2", [await PlayerData.get(player, 'pName'), args[1], await PlayerData.get(taraf, 'pName')])
    await sendchat(player, await Language.GetValue(player.getSyncedMeta('Language'), "YOU_GAVE_STAFFPOINT_PLAYER2", [args[1], await PlayerData.get(taraf, 'pName')]))
    await sendchat(taraf, await Language.GetValue(taraf.getSyncedMeta('Language'), "ADMIN_GIVEN_STAFFPOINT_YOU", [await PlayerData.get(player, 'pName'), args[1]]))
}
async function TakeStaffPoint(player, args) {
    if (!await StaffSystem.IsAdmin(player)) return await StaffSystem.Send_NotAdmin(player)
    if (!await StaffSystem.CMD.Level.check(player, 'TakeStaffPoint'))
        return await StaffSystem.Send_Auth(player)
    if (args[0] == undefined || args[1] == undefined)
        return sendchat(player, 'TakeStaffPoint(TakeSP) [PlayerName/PlayerID] [Amount]');
    let taraf = await FindPlayerForCMD(player, args[0])
    if (taraf == undefined) return
    //--------------------------------------------------
    await StaffPoint.take(taraf, parseInt(args[1]))
    await StaffSystem.CalculatorRole(player)
    await StaffSystem.Warn.Admins("ADMIN_TAKED_STAFFPOINT_TO_PLAYER2", [await PlayerData.get(player, 'pName'), args[1], await PlayerData.get(taraf, 'pName')])
    await sendchat(player, await Language.GetValue(player.getSyncedMeta('Language'), "YOU_TAKE_STAFFPOINT_PLAYER2", [args[1], await PlayerData.get(taraf, 'pName')]))
    await sendchat(taraf, await Language.GetValue(taraf.getSyncedMeta('Language'), "ADMIN_TAKEN_STAFFPOINT_YOU", [await PlayerData.get(player, 'pName'), args[1]]))
}
async function SetStaffPoint(player, args) {
    if (!await StaffSystem.IsAdmin(player)) return await StaffSystem.Send_NotAdmin(player)
    if (!await StaffSystem.CMD.Level.check(player, 'SetStaffPoint'))
        return await StaffSystem.Send_Auth(player)
    if (args[0] == undefined || args[1] == undefined)
        return sendchat(player, 'SetStaffPoint(SetSP) [PlayerName/PlayerID] [Amount]');
    let taraf = await FindPlayerForCMD(player, args[0])
    if (taraf == undefined) return
    //--------------------------------------------------
    await StaffPoint.set(taraf, parseInt(args[1]))
    await StaffSystem.CalculatorRole(player)
    await StaffSystem.Warn.Admins("ADMIN_SETED_STAFFPOINT_TO_PLAYER2", [await PlayerData.get(player, 'pName'), args[1], await PlayerData.get(taraf, 'pName')])
    await sendchat(player, await Language.GetValue(player.getSyncedMeta('Language'), "YOU_SET_STAFFPOINT_PLAYER2", [args[1], await PlayerData.get(taraf, 'pName')]))
    await sendchat(taraf, await Language.GetValue(taraf.getSyncedMeta('Language'), "ADMIN_SETEN_STAFFPOINT_YOU", [await PlayerData.get(player, 'pName'), args[1]]))
}
async function CreateAdminVehicle(player, args) {
    if (!await StaffSystem.IsAdmin(player)) return await StaffSystem.Send_NotAdmin(player)
    if (!await StaffSystem.CMD.Level.check(player, 'CreateAdminVehicle'))
        return await StaffSystem.Send_Auth(player)
    if (args[0] == undefined)
        return sendchat(player, 'AdminVehicle(veh) [Model]');
    //--------------------------------------------------
    if (isNaN(args[0]) && args[0] != undefined && args[0].length >= 3) {
        for (const [key, str] of Object.entries(vehicleObject)) {
            if (str.name.match(args[0].toLowerCase())) {
                return await VehicleClass.create.admin(player, str.name)
            }
            if (str.name == "end") {
                return sendchat(player, `esme veh eshtebas`);
            }
        }
    } else if (!isNaN(args[0]) && args[0] != undefined) {
        for (const [key, str] of Object.entries(vehicleObject)) {
            if (args[0] >= 400 && args[0] <= 700) {
                if (str.id == args[0]) {
                    return await VehicleClass.create.admin(player, str.name)
                }
                if (str.name == "end") {
                    return sendchat(player, `id veh eshtebas`);
                }
            } else {
                return sendchat(player, `faqat az 400 ta 561`);
            }
        }
    } else {
        return sendchat(player, `faqat az 400 ta 561`);
    }

}
async function DeleteAdminVehicle(player) {
    if (!await StaffSystem.IsAdmin(player)) return await StaffSystem.Send_NotAdmin(player)
    if (!await StaffSystem.CMD.Level.check(player, 'DeleteAdminVehicle'))
        return await StaffSystem.Send_Auth(player)
    //--------------------------------------------------
    if (!player.vehicle)
        return sendchat(player, 'AdminVehicle(veh) [Model]');
    let a = await VehicleClass.delete.admin(player.vehicle)
    a == true ? console.log("deleted") : console.log("you can not delete this vehicle")
}
async function DeleteStaticVehicle(player) {
    if (!await StaffSystem.IsAdmin(player)) return await StaffSystem.Send_NotAdmin(player)
    if (!await StaffSystem.CMD.Level.check(player, 'DeleteStaticVehicle'))
        return await StaffSystem.Send_Auth(player)
    //--------------------------------------------------
    if (!player.vehicle)
        return sendchat(player, 'AdminVehicle(veh) [Model]');
    let vehicle_ = await VehicleClass.delete.static(player.vehicle)
    if (vehicle_) {
        return await StaffSystem.Warn.Admins("ADMIN_DELETED_STATIC_VEHICLE", [await PlayerData.get(player, 'pName'), vehicle_[0], vehicle_[1], JSON.stringify(vehicle_[2])])
    } else {
        await sendchat(player, await Language.GetValue(player.getSyncedMeta('Language'), "YOU_CAN_NOT_DELETE_THIS_VEHICLE"))
    }
}
async function DeleteFactionVehicle(player) {
    if (!await StaffSystem.IsAdmin(player)) return await StaffSystem.Send_NotAdmin(player)
    if (!await StaffSystem.CMD.Level.check(player, 'DeleteFactionVehicle'))
        return await StaffSystem.Send_Auth(player)
    //--------------------------------------------------
    if (!player.vehicle)
        return sendchat(player, 'AdminVehicle(veh) [Model]');
    let vehicle_ = await VehicleClass.delete.faction(player.vehicle)
    if (vehicle_) {
        return await StaffSystem.Warn.Admins("ADMIN_DELETED_FACTION_VEHICLE", [await PlayerData.get(player, 'pName'), vehicle_[0], vehicle_[1], JSON.stringify(vehicle_[2])])
    } else {
        await sendchat(player, await Language.GetValue(player.getSyncedMeta('Language'), "YOU_CAN_NOT_DELETE_THIS_VEHICLE"))
    }
}
async function CreateStaticVehicle(player, args) {
    if (!await StaffSystem.IsAdmin(player)) return await StaffSystem.Send_NotAdmin(player)
    if (!await StaffSystem.CMD.Level.check(player, 'CreateStaticVehicle'))
        return await StaffSystem.Send_Auth(player)
    if (args[0] == undefined)
        return sendchat(player, 'StaticVehicle(csv) [Type]');
    //--------------------------------------------------
    switch (args[0]) {
        case 'driving':
            await VehicleClass.create.static(player, 'driving')
            return await StaffSystem.Warn.Admins("ADMIN_CREATED_STATIC_VEHICLE", [await PlayerData.get(player, 'pName'), args[0], `x:${(player.pos.x).toFixed(3)} , y:${(player.pos.y).toFixed(3)} , z:${(player.pos.z).toFixed(3)}`])
        case 'sailing':
            await VehicleClass.create.static(player, 'sailing')
            return await StaffSystem.Warn.Admins("ADMIN_CREATED_STATIC_VEHICLE", [await PlayerData.get(player, 'pName'), args[0], `x:${(player.pos.x).toFixed(3)} , y:${(player.pos.y).toFixed(3)} , z:${(player.pos.z).toFixed(3)}`])
        case 'riding':
            await VehicleClass.create.static(player, 'riding')
            return await StaffSystem.Warn.Admins("ADMIN_CREATED_STATIC_VEHICLE", [await PlayerData.get(player, 'pName'), args[0], `x:${(player.pos.x).toFixed(3)} , y:${(player.pos.y).toFixed(3)} , z:${(player.pos.z).toFixed(3)}`])
        case 'motor':
            await VehicleClass.create.static(player, 'motor')
            return await StaffSystem.Warn.Admins("ADMIN_CREATED_STATIC_VEHICLE", [await PlayerData.get(player, 'pName'), args[0], `x:${(player.pos.x).toFixed(3)} , y:${(player.pos.y).toFixed(3)} , z:${(player.pos.z).toFixed(3)}`])
        case 'flying':
            await VehicleClass.create.static(player, 'flying')
            return await StaffSystem.Warn.Admins("ADMIN_CREATED_STATIC_VEHICLE", [await PlayerData.get(player, 'pName'), args[0], `x:${(player.pos.x).toFixed(3)} , y:${(player.pos.y).toFixed(3)} , z:${(player.pos.z).toFixed(3)}`])
        default:
            return sendchat(player, 'StaticVehicle(csv) [Type]: driving | sailing | riding | motor | flying');
    }
}
async function CreateFactionVehicle(player, args) {
    if (!await StaffSystem.IsAdmin(player)) return await StaffSystem.Send_NotAdmin(player)
    if (!await StaffSystem.CMD.Level.check(player, 'CreateFactionVehicle'))
        return await StaffSystem.Send_Auth(player)
    if (args[0] == undefined && args[1] == undefined && args[2] == undefined)
        return sendchat(player, 'CreateFactionVehicle(cfv) [Model] [FactionID] [Rank]');
    //--------------------------------------------------
    if (isNaN(args[0]) && args !== undefined && args[0].length >= 3) {
        for (const [key, str] of Object.entries(vehicleObject)) {
            if (str.name.match(args[0].toLowerCase())) {
                await VehicleClass.create.faction(player, str.name)
                return await StaffSystem.Warn.Admins("ADMIN_CREATED_FACTION_VEHICLE", [await PlayerData.get(player, 'pName'), args[0], args[1], args[2], player.pos])
            }
            if (str.name == "end") {
                return sendchat(player, `esme veh eshtebas`);
            }
        }
    } else if (!isNaN(args[0]) && args[0] != undefined) {
        for (const [key, str] of Object.entries(vehicleObject)) {
            if (args[0] >= 400 && args[0] <= 700) {
                if (str.id == args[0]) {
                    await VehicleClass.create.faction(player, str.name)
                    return await StaffSystem.Warn.Admins("ADMIN_CREATED_FACTION_VEHICLE", [await PlayerData.get(player, 'pName'), `(ID:${args[0]})`, args[1], args[2], player.pos])
                }
                if (str.name == "end") {
                    return sendchat(player, `id veh eshtebas`);
                }
            } else {
                return sendchat(player, `faqat az 400 ta 561`);
            }
        }
    } else {
        return sendchat(player, `faqat az 400 ta 561`);
    }
}
async function GotoPlace(player, args) {
    if (!await StaffSystem.IsAdmin(player)) return await StaffSystem.Send_NotAdmin(player)
    if (!await StaffSystem.CMD.Level.check(player, 'GotoPlace'))
        return await StaffSystem.Send_Auth(player)
    if (args[0] == undefined && args[1] == undefined)
        return sendchat(player, 'GotoPlace [Place Group] [ID]');
    //--------------------------------------------------
    switch (args[0].toLowerCase()) {
        case 'business':
            let pos = await Business.Data.get(args[1], 'Pos')
            if (pos) {
                player.pos = JSON.parse(pos)
                return await StaffSystem.Warn.Admins("ADMIN_GOED_TO_PLACE", [await PlayerData.get(player, 'pName'), args[0].toLowerCase(), args[1]])
            }
            break;

        default:
            break;
    }
}
async function GiveMoney(player, args) {
    if (!await StaffSystem.IsAdmin(player)) return await StaffSystem.Send_NotAdmin(player)
    if (!(await StaffSystem.CheckObject.MakeAdmin(player) && await StaffSystem.CMD.Level.check(player, 'GiveMoney')))
        return await StaffSystem.Send_Auth(player)
    if (args[0] == undefined || args[1] == undefined)
        return sendchat(player, 'GiveMoney [PlayerName/PlayerID] [Ammount]');
    let taraf = await FindPlayerForCMD(player, args[0])
    if (taraf == undefined) return
    //--------------------------------------------------
    await Money.give(player, args[1])
    await StaffSystem.Warn.Admins("ADMIN_GIVED_MONEY_TO_PLAYER2", [await PlayerData.get(player, 'pName'), args[1], await PlayerData.get(taraf, 'pName')])
    await sendchat(player, await Language.GetValue(player.getSyncedMeta('Language'), "YOU_GAVE_MONEY_TO_PLAYER2", [args[1], await PlayerData.get(taraf, 'pName')]))
    await sendchat(taraf, await Language.GetValue(taraf.getSyncedMeta('Language'), "ADMIN_GIVEN_MONEY_TO_YOU", [await PlayerData.get(player, 'pName'), args[1]]))
}
async function TakeMoney(player, args) {
    if (!await StaffSystem.IsAdmin(player)) return await StaffSystem.Send_NotAdmin(player)
    if (!(await StaffSystem.CheckObject.MakeAdmin(player) && await StaffSystem.CMD.Level.check(player, 'TakeMoney')))
        return await StaffSystem.Send_Auth(player)
    if (args[0] == undefined || args[1] == undefined)
        return sendchat(player, 'TakeMoney [PlayerName/PlayerID] [Ammount]');
    let taraf = await FindPlayerForCMD(player, args[0])
    if (taraf == undefined) return
    //--------------------------------------------------
    await Money.take(player, args[1])
    await StaffSystem.Warn.Admins("ADMIN_TAKED_MONEY_TO_PLAYER2", [await PlayerData.get(player, 'pName'), args[1], await PlayerData.get(taraf, 'pName')])
    await sendchat(player, await Language.GetValue(player.getSyncedMeta('Language'), "YOU_TAKE_MONEY_TO_PLAYER2", [args[1], await PlayerData.get(taraf, 'pName')]))
    await sendchat(taraf, await Language.GetValue(taraf.getSyncedMeta('Language'), "ADMIN_TAKEN_MONEY_TO_YOU", [await PlayerData.get(player, 'pName'), args[1]]))
}
async function SetMoney(player, args) {
    if (!await StaffSystem.IsAdmin(player)) return await StaffSystem.Send_NotAdmin(player)
    if (!(await StaffSystem.CheckObject.MakeAdmin(player) && await StaffSystem.CMD.Level.check(player, 'SetMoney')))
        return await StaffSystem.Send_Auth(player)
    if (args[0] == undefined || args[1] == undefined)
        return sendchat(player, 'SetMoney [PlayerName/PlayerID] [Ammount]');
    let taraf = await FindPlayerForCMD(player, args[0])
    if (taraf == undefined) return
    //--------------------------------------------------
    await Money.take(player, args[1])
    await StaffSystem.Warn.Admins("ADMIN_SETED_MONEY_TO_PLAYER2", [await PlayerData.get(player, 'pName'), args[1], await PlayerData.get(taraf, 'pName')])
    await sendchat(player, await Language.GetValue(player.getSyncedMeta('Language'), "YOU_SET_MONEY_TO_PLAYER2", [args[1], await PlayerData.get(taraf, 'pName')]))
    await sendchat(taraf, await Language.GetValue(taraf.getSyncedMeta('Language'), "ADMIN_SETEN_MONEY_TO_YOU", [await PlayerData.get(player, 'pName'), args[1]]))
}
async function SetGold(player, args) {
    if (!await StaffSystem.IsAdmin(player)) return await StaffSystem.Send_NotAdmin(player)
    if (!(await StaffSystem.CheckObject.MakeAdmin(player) && await StaffSystem.CMD.Level.check(player, 'SetGold')))
        return await StaffSystem.Send_Auth(player)
    if (args[0] == undefined || args[1] == undefined)
        return sendchat(player, 'SetGold [PlayerName/PlayerID] [Ammount]');
    let taraf = await FindPlayerForCMD(player, args[0])
    if (taraf == undefined) return
    //--------------------------------------------------
    await Money.take(player, args[1])
    await StaffSystem.Warn.Admins("ADMIN_SETED_GOLD_TO_PLAYER2", [await PlayerData.get(player, 'pName'), args[1], await PlayerData.get(taraf, 'pName')])
    await sendchat(player, await Language.GetValue(player.getSyncedMeta('Language'), "YOU_SET_GOLD_TO_PLAYER2", [args[1], await PlayerData.get(taraf, 'pName')]))
    await sendchat(taraf, await Language.GetValue(taraf.getSyncedMeta('Language'), "ADMIN_SETEN_GOLD_TO_YOU", [await PlayerData.get(player, 'pName'), args[1]]))
}
async function GiveGold(player, args) {
    if (!await StaffSystem.IsAdmin(player)) return await StaffSystem.Send_NotAdmin(player)
    if (!(await StaffSystem.CheckObject.MakeAdmin(player) && await StaffSystem.CMD.Level.check(player, 'GiveGold')))
        return await StaffSystem.Send_Auth(player)
    if (args[0] == undefined || args[1] == undefined)
        return sendchat(player, 'GiveGold [PlayerName/PlayerID] [Ammount]');
    let taraf = await FindPlayerForCMD(player, args[0])
    if (taraf == undefined) return
    //--------------------------------------------------
    await Money.give(player, args[1])
    await StaffSystem.Warn.Admins("ADMIN_GIVED_GOLD_TO_PLAYER2", [await PlayerData.get(player, 'pName'), args[1], await PlayerData.get(taraf, 'pName')])
    await sendchat(player, await Language.GetValue(player.getSyncedMeta('Language'), "YOU_GAVE_GOLD_TO_PLAYER2", [args[1], await PlayerData.get(taraf, 'pName')]))
    await sendchat(taraf, await Language.GetValue(taraf.getSyncedMeta('Language'), "ADMIN_GIVEN_GOLD_TO_YOU", [await PlayerData.get(player, 'pName'), args[1]]))
}
async function TakeGold(player, args) {
    if (!await StaffSystem.IsAdmin(player)) return await StaffSystem.Send_NotAdmin(player)
    if (!(await StaffSystem.CheckObject.MakeAdmin(player) && await StaffSystem.CMD.Level.check(player, 'TakeGold')))
        return await StaffSystem.Send_Auth(player)
    if (args[0] == undefined || args[1] == undefined)
        return sendchat(player, 'GiveGold [PlayerName/PlayerID] [Ammount]');
    let taraf = await FindPlayerForCMD(player, args[0])
    if (taraf == undefined) return
    //--------------------------------------------------
    await Money.take(player, args[1])
    await StaffSystem.Warn.Admins("ADMIN_TAKED_GOLD_TO_PLAYER2", [await PlayerData.get(player, 'pName'), args[1], await PlayerData.get(taraf, 'pName')])
    await sendchat(player, await Language.GetValue(player.getSyncedMeta('Language'), "YOU_TAKE_GOLD_TO_PLAYER2", [args[1], await PlayerData.get(taraf, 'pName')]))
    await sendchat(taraf, await Language.GetValue(taraf.getSyncedMeta('Language'), "ADMIN_TAKEN_GOLD_TO_YOU", [await PlayerData.get(player, 'pName'), args[1]]))
}
async function SetRespect(player, args) {
    if (!await StaffSystem.IsAdmin(player)) return await StaffSystem.Send_NotAdmin(player)
    if (!(await StaffSystem.CheckObject.MakeAdmin(player) && await StaffSystem.CMD.Level.check(player, 'SetRespect')))
        return await StaffSystem.Send_Auth(player)
    if (args[0] == undefined || args[1] == undefined)
        return sendchat(player, 'SetRespect [PlayerName/PlayerID] [Ammount]');
    let taraf = await FindPlayerForCMD(player, args[0])
    if (taraf == undefined) return
    //--------------------------------------------------
    await Money.take(player, args[1])
    await StaffSystem.Warn.Admins("ADMIN_SETED_RESPECT_TO_PLAYER2", [await PlayerData.get(player, 'pName'), args[1], await PlayerData.get(taraf, 'pName')])
    await sendchat(player, await Language.GetValue(player.getSyncedMeta('Language'), "YOU_SET_RESPECT_TO_PLAYER2", [args[1], await PlayerData.get(taraf, 'pName')]))
    await sendchat(taraf, await Language.GetValue(taraf.getSyncedMeta('Language'), "ADMIN_SETEN_RESPECT_TO_YOU", [await PlayerData.get(player, 'pName'), args[1]]))
}
async function GiveRespect(player, args) {
    if (!await StaffSystem.IsAdmin(player)) return await StaffSystem.Send_NotAdmin(player)
    if (!(await StaffSystem.CheckObject.MakeAdmin(player) && await StaffSystem.CMD.Level.check(player, 'GiveRespect')))
        return await StaffSystem.Send_Auth(player)
    if (args[0] == undefined || args[1] == undefined)
        return sendchat(player, 'GiveRespect [PlayerName/PlayerID] [Ammount]');
    let taraf = await FindPlayerForCMD(player, args[0])
    if (taraf == undefined) return
    //--------------------------------------------------
    await Money.give(player, args[1])
    await StaffSystem.Warn.Admins("ADMIN_GIVED_RESPECT_TO_PLAYER2", [await PlayerData.get(player, 'pName'), args[1], await PlayerData.get(taraf, 'pName')])
    await sendchat(player, await Language.GetValue(player.getSyncedMeta('Language'), "YOU_GAVE_RESPECT_TO_PLAYER2", [args[1], await PlayerData.get(taraf, 'pName')]))
    await sendchat(taraf, await Language.GetValue(taraf.getSyncedMeta('Language'), "ADMIN_GIVEN_RESPECT_TO_YOU", [await PlayerData.get(player, 'pName'), args[1]]))
}
async function TakeRespect(player, args) {
    if (!await StaffSystem.IsAdmin(player)) return await StaffSystem.Send_NotAdmin(player)
    if (!(await StaffSystem.CheckObject.MakeAdmin(player) && await StaffSystem.CMD.Level.check(player, 'TakeRespect')))
        return await StaffSystem.Send_Auth(player)
    if (args[0] == undefined || args[1] == undefined)
        return sendchat(player, 'TakeRespect [PlayerName/PlayerID] [Ammount]');
    let taraf = await FindPlayerForCMD(player, args[0])
    if (taraf == undefined) return
    //--------------------------------------------------
    await Money.take(player, args[1])
    await StaffSystem.Warn.Admins("ADMIN_TAKED_RESPECT_TO_PLAYER2", [await PlayerData.get(player, 'pName'), args[1], await PlayerData.get(taraf, 'pName')])
    await sendchat(player, await Language.GetValue(player.getSyncedMeta('Language'), "YOU_TAKE_RESPECT_TO_PLAYER2", [args[1], await PlayerData.get(taraf, 'pName')]))
    await sendchat(taraf, await Language.GetValue(taraf.getSyncedMeta('Language'), "ADMIN_TAKEN_RESPECT_TO_YOU", [await PlayerData.get(player, 'pName'), args[1]]))
}



registerCmd('makeadmin', MakeAdmin)
registerCmd('MA', MakeAdmin)
registerCmd('GiveStaffPoint', GiveStaffPoint)
registerCmd('GiveSP', GiveStaffPoint)
registerCmd('TakeStaffPoint', TakeStaffPoint)
registerCmd('TakeSP', TakeStaffPoint)
registerCmd('SetStaffPoint', SetStaffPoint)
registerCmd('SetSP', SetStaffPoint)
registerCmd('AdminVehicle', CreateAdminVehicle)
registerCmd('veh', CreateAdminVehicle)
registerCmd('DV', DeleteAdminVehicle)
registerCmd('DeleteAdminVehicle', DeleteAdminVehicle)
registerCmd('DSV', DeleteStaticVehicle)
registerCmd('DeleteStaticVehicle', DeleteStaticVehicle)
registerCmd('DFV', DeleteFactionVehicle)
registerCmd('DeleteFactionVehicle', DeleteFactionVehicle)
registerCmd('CSV', CreateStaticVehicle)
registerCmd('createStaticVehicle', CreateStaticVehicle)
registerCmd('Cfv', CreateFactionVehicle)
registerCmd('CreateFactionVehicle', CreateFactionVehicle)
registerCmd('Goto', GotoPlace)
registerCmd('GiveMoney', GiveMoney)
registerCmd('TakeMoney', TakeMoney)
registerCmd('SetMoney', SetMoney)
registerCmd('SetGold', SetGold)
registerCmd('TakeGold', TakeGold)
registerCmd('GiveGold', GiveGold)
registerCmd('SetRespect', SetRespect)
registerCmd('GiveRespect', GiveRespect)
registerCmd('TakeRespect', TakeRespect)

registerCmd('cb', async (player, args) => {
    let a = await sql(`insert into business (Owner,Pos) values ('-1','${JSON.stringify({ x: player.pos.x, y: player.pos.y, z: player.pos.z })}')`)
    console.log(a)
})


registerCmd("test", async (player, args) => {
    await PlayerData.set(player, 'pAdmin', args[0], true)
});



// registerCmd('veh', AdminVehicle)



// registerCmd("clothes", (player) => {
//     // Set clothes
//     alt.emitClient(
//         player,
//         "CLIENT:Clothes",
//         player.getMeta("Gender"),
//         clothes.GetClothesUtils()
//     );
// });

// registerCmd("getpos", (player) => {
//     sendchat(
//         player,
//         `X: ${player.pos.x}, Y: ${player.pos.y}, Z: ${player.pos.z}\n RX: ${player.rot.x}, RY: ${player.rot.y}, RZ: ${player.rot.z}`
//     );
// });
// registerCmd("gotoplace", (player, args) => {
//     if (!args[0] || !isNaN(args[0])) {
//         return sendchat(player, "/GotoPlace (Location name)");
//     }
//     let PlaceName = args[0].toLowerCase();
//     if (locations[PlaceName]) {
//         player.pos = {
//             x: locations[PlaceName].x,
//             y: locations[PlaceName].y,
//             z: locations[PlaceName].z,
//         };
//         player.rot = {
//             x: locations[PlaceName].rx,
//             y: locations[PlaceName].ry,
//             z: locations[PlaceName].rz,
//         };
//         sendchat(player, `You have been teleport to place ${PlaceName}`);
//     } else {
//         sendchat(player, `{ff0000}${PlaceName} is not found`);
//     }
// });
// let PositionsSaved = [];
// registerCmd("savepos", async (player, arg) => {
//     return;
// });