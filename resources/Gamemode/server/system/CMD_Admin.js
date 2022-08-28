import { sql } from "../database/mysql";
import { vehicleObject } from "../utils/VehicleList";
import { FindPlayerAccount, FindPlayerForCMD, PlayerData } from "./account";
import { Business } from "./business";
import { registerCmd, sendchat } from "./chat";
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
    let a = await VehicleClass.delete.static(player.vehicle)
    a == true ? console.log("deleted") : console.log("you can not delete this vehicle")
}
async function DeleteFactionVehicle(player) {
    if (!await StaffSystem.IsAdmin(player)) return await StaffSystem.Send_NotAdmin(player)
    if (!await StaffSystem.CMD.Level.check(player, 'DeleteFactionVehicle'))
        return await StaffSystem.Send_Auth(player)
    //--------------------------------------------------
    if (!player.vehicle)
        return sendchat(player, 'AdminVehicle(veh) [Model]');
    let a = await VehicleClass.delete.faction(player.vehicle)
    a == true ? console.log("deleted") : console.log("you can not delete this vehicle")
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
            return await VehicleClass.create.static(player, 'driving')
        case 'sailing':
            return await VehicleClass.create.static(player, 'sailing')
        case 'riding':
            return await VehicleClass.create.static(player, 'riding')
        case 'motor':
            return await VehicleClass.create.static(player, 'motor')
        case 'flying':
            return await VehicleClass.create.static(player, 'flying')
        default:
            return sendchat(player, 'StaticVehicle(csv) [Type]: driving | sailing | riding | motor | flying');

    }
}
async function CreateFactionVehicle(player, args) {
    if (!await StaffSystem.IsAdmin(player)) return await StaffSystem.Send_NotAdmin(player)
    if (!await StaffSystem.CMD.Level.check(player, 'CreateFactionVehicle'))
        return await StaffSystem.Send_Auth(player)
    if (args[0] == undefined && args[1] == undefined)
        return sendchat(player, 'AdminVehicle(veh) [Model]');
    //--------------------------------------------------
    if (isNaN(args[0]) && args !== undefined && args[0].length >= 3) {
        for (const [key, str] of Object.entries(vehicleObject)) {
            if (str.name.match(args[0].toLowerCase())) {
                return await VehicleClass.create.faction(player, str.name)
            }
            if (str.name == "end") {
                return sendchat(player, `esme veh eshtebas`);
            }
        }
    } else if (!isNaN(args[0]) && args[0] != undefined) {
        for (const [key, str] of Object.entries(vehicleObject)) {
            if (args[0] >= 400 && args[0] <= 700) {
                if (str.id == args[0]) {
                    return await VehicleClass.create.faction(player, str.name)
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
            }

            break;

        default:
            break;
    }
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