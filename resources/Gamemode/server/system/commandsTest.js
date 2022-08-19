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
  console.log(
    `ROT = x: ${player.rot.x}, y: ${player.rot.y}, z: ${player.rot.z}`
  );
});
registerCmd("gpp", (player) => {
  console.log(
    `{x: ${player.pos.x.toFixed(3)}, y:${player.pos.y.toFixed(3)}, z:${
      player.pos.z.toFixed(3) - 1
    }, heading:${player.rot.z * (180 / Math.PI)}}`
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

registerCmd("front", (player, args) => {
  if (!args) return;
  function getVectorInFrontOfPlayer(entity, distance) {
    const forwardVector = {
      x: -Math.sin(entity.rot.z + 90) * Math.abs(Math.cos(entity.rot.x)),
      y: Math.cos(entity.rot.z + 90) * Math.abs(Math.cos(entity.rot.x)),
      z: Math.sin(entity.rot.x),
    };
    const posFront = {
      x: entity.pos.x + forwardVector.x * distance,
      y: entity.pos.y + forwardVector.y * distance,
      z: entity.pos.z,
    };
    return new alt.Vector3(posFront.x, posFront.y, posFront.z);
  }
  console.log(player.rot);
  player.pos = getVectorInFrontOfPlayer(player, args);
});
