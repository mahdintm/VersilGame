/// <reference types="@altv/types-server" />
import * as alt from "alt-server";
import { EventNames } from "../utils/eventNames";
import { PlayerData } from "./account";

class VGScoreBoardServer {
  static async #GetPlayersDetails() {
    let PlayersDetails = [];
    for await (const player of alt.Player.all) {
      PlayersDetails.push({
        ID: await PlayerData.get(player, "gameID"),
        Name: await PlayerData.get(player, "pName"),
        Ping: player.ping,
        Level: await PlayerData.get(player, "pLevel"),
      });
    }
    return PlayersDetails;
  }
  static #GetConnectedPlayers() {
    return alt.Player.all.length;
  }
  static async GetScoreBoardDetails() {
    const ScoreBoardDetails = {
      PlayersLimit: 1024,
      ConnectedPlayers: this.#GetConnectedPlayers(),
      UpTimeServer: "unknow",
      PlayerPlayTime: "unknow",
      PlayersDetails: await this.#GetPlayersDetails(),
    };
    return ScoreBoardDetails;
  }
}

alt.onClient(
  EventNames.scoreBoard.client.GetScoreBoardDetails,
  async (player) => {
    alt.emitClient(
      player,
      EventNames.scoreBoard.server.SetScoreBoardDetails,
      await VGScoreBoardServer.GetScoreBoardDetails()
    );
  }
);
