import { PlayerData } from "./account";

export class Hoster {
  static async IsHoster(player) {
    return (await PlayerData.Get(player, "pHoster")) >= 1 ? true : false;
  }

  static async CheckHoster(player, Level) {
    return (await PlayerData.Get(player, "pHoster")) >= Level ? true : false;
  }
}
