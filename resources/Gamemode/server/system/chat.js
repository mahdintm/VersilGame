/// <reference types="@altv/types-server" />
import * as alt from "alt-server";
import { findbadword } from "../utils/badword_detect";
import { PlayerData } from "./account";
// import { findbadword } from "../utility/badword_detect";
let cmdHandlers = {};
// let mutedPlayers = new Map();

// function checkmute(player) {
//     if (GetPlayerData(player, "pMute")) {
//         if (GetPlayerData(player, "pMute_Time") <= Date.now) {
//             return true;
//         } else {
//             return false;
//         }
//     } else {
//         return true
//     }
// }

/**
 * For send a message in chat system to a player
 * @param {object} player player object altv
 * @param {string} msg Your message
 *
 */
export async function sendchat(player, msg) {
  alt.emitClient(player, "chat:message", Date.now(), null, msg);
}

/**
 * For Create CMD
 * @param {string} cmd Name of Command
 * @param {Function} callback function of Command
 *
 */
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
alt.onClient("Chat:Loaded", (player) => {
  alt.emitClient(
    player,
    "chat:message",
    Date.now(),
    null,
    "Connected To Server!"
  );
});
alt.onClient("chat:message", async (player, msg) => {
  if (msg[0] === "/") {
    msg = msg.trim().slice(1);
    if (msg.length > 0) {
      let args = msg.split(" ");
      let cmd = args.shift();
      invokeCmd(player, cmd, args);
    }
  } else {
    // if (checkmute(player)) {
    msg = msg.trim();
    if (!msg.length) return;
    let PlayerName = await PlayerData.get(player, "pName");
    let msgfilltered = findbadword(msg)
      .replace(/</g, "&lt;")
      .replace(/'/g, "&#39")
      .replace(/"/g, "&#34");
    const playerPos = player.pos;
    const players = alt.Player.all;
    for (let p of players) {
      if (
        playerPos.distanceTo(p.pos) > process.env.Chat_Distance ||
        player == p
      )
        continue;
      alt.emitClient(p, "chat:message", Date.now(), PlayerName, msgfilltered);
    }
    alt.emitClient(
      player,
      "chat:message",
      Date.now(),
      PlayerName,
      msgfilltered
    );
    // } else {
    //     alt.emitClient(player, "chat:message", null, "You are muted.");
    // }
  }
});