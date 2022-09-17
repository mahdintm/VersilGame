import * as alt from "alt";
import { PlayerData } from "./account";

export class Respect {
  static async payday() {
    const players = alt.Player.all;
    for (let i = 0; i < players.length; i++) {
      if (players[i].getSyncedMeta("hasLogin")) await PlayerData.Set(players[i], "pRespect", parseInt(await PlayerData.Get(players[i], "pRespect")) + 1, true);
    }
  }

  static async Get(player) {
    return parseInt(await PlayerData.Get(player, "pRespect"));
  }
  static async Give(player, ammount) {
    return await PlayerData.Set(player, "pRespect", parseInt(await PlayerData.Get(player[i], "pRespect")) + parseInt(ammount), true);
  }
  static async Set(player, ammount) {
    return await PlayerData.Set(player, "pRespect", parseInt(ammount), true);
  }
  static async Take(player) {
    return await PlayerData.Set(player, "pRespect", parseInt(await PlayerData.Get(player[i], "pRespect")) - parseInt(ammount), true);
  }
}
