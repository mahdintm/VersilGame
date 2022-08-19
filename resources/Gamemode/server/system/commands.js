import * as alt from "alt-server";
import { EventNames } from "../utils/eventNames";
import { registerCmd, sendchat } from "./chat";

//Free Commands Functions
function ShowTimeStamp(player, args) {
  return alt.emitClient(player, EventNames.chat.server.TimeStamp);
}

//FreeCommands RegisterCMD
registerCmd("timestamp", ShowTimeStamp);
