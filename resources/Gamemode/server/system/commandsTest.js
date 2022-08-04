/// <reference types="@altv/types-shared" />
/// <reference types="@altv/types-server" />
import * as alt from "alt-server";
import { registerCmd, sendchat } from "./chat";

registerCmd("g", (player) => {
  alt.emitClient(player, "teleportToWaypoint");
});
registerCmd("gp", (player) => {
  console.log(
    `x: ${player.pos.x.toFixed(3)}, y: ${player.pos.y.toFixed(
      3
    )}, z: ${player.pos.z.toFixed(3)}`
  );
});

registerCmd("vs", (player, args) => {
  if (!args) return;
  if (!player.vehicle)
    return sendchat(player, `{ff0000}You are not enter a vehicle`);
  if (args[0] == "d") {
    player.vehicle.driftModeEnabled
      ? (player.vehicle.driftModeEnabled = false)
      : (player.vehicle.driftModeEnabled = true);

    sendchat(player, `Vehicle drift ${player.vehicle.driftModeEnabled}`);
  }
  if (args[0] == "r") {
    player.vehicle.repair();
  }
});

alt.on("playerDamage", (player) => {
  player.health = 1000;
  player.clearBloodDamage();
});
alt.on("playerDeath", (player) => {
  player.spawn(player.pos);
  player.clearBloodDamage();
});
