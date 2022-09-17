import { PlayerData } from "./account";

export class Money {
  static async set(player, ammount) {
    await PlayerData.Set(player, "pMoney", parseInt(ammount), true);
  }
  static async get(player) {
    return parseInt(await PlayerData.Get(player, "pMoney"));
  }
  static async take(player, ammount) {
    await PlayerData.Set(player, "pMoney", parseInt(await PlayerData.Get(player, "pMoney")) - parseInt(ammount), true);
  }
  static async give(player, ammount) {
    await PlayerData.Set(player, "pMoney", parseInt(await PlayerData.Get(player, "pMoney")) + parseInt(ammount), true);
  }
}
