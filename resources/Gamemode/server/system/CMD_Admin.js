import { FindPlayerAccount, FindPlayerForCMD, PlayerData } from "./account";
import { registerCmd, sendchat } from "./chat";
import { StaffPoint, StaffSystem } from "./staff";

async function MakeAdmin(player, args) {
    if (!await StaffSystem.IsAdmin(player)) return await StaffSystem.Send_NotAdmin(player)
    if (!(await StaffSystem.CheckObject.MakeAdmin(player) && await StaffSystem.CMD.Level.check('MakeAdmin')))
        return await StaffSystem.Send_Auth(player)
    if (args[0] == undefined || args[1] == undefined)
        return sendchat(player, 'makeadmin(ma) [PlayerName/PlayerID] [AdminLevel]');
    let taraf = await FindPlayerForCMD(player, args[0])
    if (taraf == undefined) return

    await PlayerData.set(taraf, 'pAdmin', args[1], true)
}

// function SetStaffPoint(player, args) {
//     StaffPoint.set(player, args[0])
// }


// function test(player, args) {

// }
registerCmd('makeadmin', MakeAdmin)
// registerCmd('ma', MakeAdmin)
// registerCmd('test', SetStaffPoint)
// registerCmd('test1', (player) => { StaffSystem.CalculatorRoleAll() })
// //Staff Commands Functions
// function AdminVehicle(player, args) {
//     if (!StaffSystem.IsAdmin(player)) return AdminSystem.Send_NotAdmin(player);
//     if (!StaffSystem.CheckAdmin(player, 1)) return AdminSystem.Send_NotAdmin(player);

// }


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