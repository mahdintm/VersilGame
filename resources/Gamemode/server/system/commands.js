import * as alt from "alt-server";
import { registerCmd, sendchat } from "./chat";


//Free Commands Functions
function ShowTimeChat(params) {
    return alt.emitClient(player, "ShowTimeStampCHAT");
}

//FreeCommands RegisterCMD
registerCmd('timechat', ShowTimeChat);