import { PlayerData } from "./account";

export class Gold {
  static async set(player, ammount) {
    await PlayerData.Set(player, "pGold", parseInt(ammount), true);
  }
  static async get(player) {
    return parseInt(await PlayerData.Get(player, "pGold"));
  }
  static async take(player, ammount) {
    await PlayerData.Set(player, "pGold", parseInt(await PlayerData.Get(player, "pGold")) - parseInt(ammount), true);
  }
  static async give(player, ammount) {
    await PlayerData.Set(player, "pGold", parseInt(await PlayerData.Get(player, "pGold")) + parseInt(ammount), true);
  }
}
