import { FindPlayerAccount, FindPlayerForCMD, PlayerData } from "./account";
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
async function AdminVehicle(player, args) {
    if (!await StaffSystem.IsAdmin(player)) return await StaffSystem.Send_NotAdmin(player)
    if (!await StaffSystem.CMD.Level.check(player, 'AdminVehicle'))
        return await StaffSystem.Send_Auth(player)
    if (args[0] == undefined)
        return sendchat(player, 'AdminVehicle(veh) [Model]');
    //--------------------------------------------------
    await VehicleClass.create.admin(player, args[0])

}

registerCmd('makeadmin', MakeAdmin)
registerCmd('MA', MakeAdmin)
registerCmd('GiveStaffPoint', GiveStaffPoint)
registerCmd('GiveSP', GiveStaffPoint)
registerCmd('TakeStaffPoint', TakeStaffPoint)
registerCmd('TakeSP', TakeStaffPoint)
registerCmd('SetStaffPoint', SetStaffPoint)
registerCmd('SetSP', SetStaffPoint)
registerCmd('AdminVehicle', AdminVehicle)
registerCmd('veh', AdminVehicle)

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