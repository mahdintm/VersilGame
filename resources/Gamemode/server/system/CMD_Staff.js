import { Language } from "../utils/dialogs";
import { registerCmd } from "./chat";
import { StaffPoint, StaffSystem } from "./staff";

async function sar(player, args) {
    if (!await StaffSystem.IsStaff(player)) return StaffSystem.Send_Auth(player)
    if (await player.getSyncedMeta('sar') == true) {
        await StaffPoint.sarOFF(player)
        console.log(false)
    } else {
        console.log(true)
        await StaffPoint.sarON(player)
    }
}

registerCmd('sar', sar)