/// <reference types="@altv/types-server" />
import * as alt from "alt-server";
import { registerCmd } from "./chat";

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

alt.on("playerDamage", (player) => {
  player.health = 1000;
  player.clearBloodDamage();
});
alt.on("playerDeath", (player) => {
  player.spawn(player.pos);
  player.clearBloodDamage();
});
