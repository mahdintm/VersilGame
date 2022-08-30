/// <reference types="@altv/types-server" />
import * as alt from "alt-server";
import { findbadword } from "../utils/badword_detect";
import { EventNames } from "../utils/eventNames";
import { PlayerData } from "./account";
import { ServerSetting } from "./server_settings";
let cmdHandlers = {};

export async function CheckMute_Chat(player) {
  if (await PlayerData.get(player, 'pMute_Chat')) {
    if (await PlayerData.get(player, "pMute_Time_Chat") <= Date.now) {
      await PlayerData.set(player, 'pMute_Chat', 0, true)
      await PlayerData.set(player, 'pMute_Time_Chat', 0, true)
      return true
    } else {
      return false
    }
  } else {
    return true
  }
}
export async function CheckMute_CMD(player) {
  if (await PlayerData.get(player, 'pMute_CMD')) {
    if (await PlayerData.get(player, "pMute_Time_CMD") <= Date.now) {
      await PlayerData.set(player, 'pMute_CMD', 0, true)
      await PlayerData.set(player, 'pMute_Time_CMD', 0, true)
      return true
    } else {
      return false
    }
  } else {
    return true
  }
}
export async function sendchat(player, msg) {
  await alt.emitClient(player, EventNames.chat.server.Message, Date.now(), null, msg);
}
export function registerCmd(cmd, callback) {
  cmd = cmd.toLowerCase();
  if (cmdHandlers[cmd] !== undefined) {
    alt.logError(`Failed to register command /${cmd}, already registered`);
  } else {
    cmdHandlers[cmd] = callback;
  }
}
function invokeCmd(player, cmd, args) {
  cmd = cmd.toLowerCase();
  const callback = cmdHandlers[cmd];
  if (callback) {
    callback(player, args);
  } else {
    sendchat(player, `{FF0000} Unknown command /${cmd}`);
  }
}
alt.onClient(EventNames.chat.client.Loaded, (player) => {
  alt.emitClient(player, EventNames.chat.server.Message, Date.now(), null, "Connected To Server!");
});
alt.onClient(EventNames.chat.client.Message, async (player, msg) => {
  if (msg[0] === "/") {
    if (await CheckMute_CMD(player)) {
      msg = msg.trim().slice(1);
      if (msg.length > 0) {
        let args = msg.split(" ");
        let cmd = args.shift();
        invokeCmd(player, cmd, args);
      }
    } else {
      sendchat(player, "You are muted.")
    }
  } else {
    if (await CheckMute_Chat(player)) {
      msg = msg.trim();
      if (!msg.length) return;
      let PlayerName = await PlayerData.get(player, "pName");
      let msgfilltered = findbadword(msg).replace(/</g, "&lt;").replace(/'/g, "&#39").replace(/"/g, "&#34");
      const playerPos = player.pos;
      const players = alt.Player.all;
      for await (let player_ of players) {
        if (playerPos.distanceTo(player_.pos) > await ServerSetting.get("Chat_Distance") || player == player_) continue;
        alt.emitClient(player_, EventNames.chat.server.Message, Date.now(), PlayerName, msgfilltered);
      }
      alt.emitClient(player, EventNames.chat.server.Message, Date.now(), PlayerName, msgfilltered);
    } else {
      sendchat(player, "You are muted.")
    }
  }
});

