/// <reference types="@altv/types-server" />
import * as alt from "alt-server";
import { EventNames } from "../utils/eventNames";
const ScoreBoardDetails = {
  PlayersLimit: 1024,
  ConnectedPlayers: 2,
  UpTimeServer: "01H 20M",
  PlayerPlayTime: "00H 30M",
  PlayersDetails: [
    {
      ID: 1,
      Name: "Toofan",
      Ping: 18,
      Level: 20,
    },
    {
      ID: 2,
      Name: "Mahdi",
      Ping: 3,
      Level: 20,
    },
  ],
};

alt.onClient(EventNames.scoreBoard.client.GetScoreBoardDetails, (player) => {
  alt.emitClient(
    player,
    EventNames.scoreBoard.server.SetScoreBoardDetails,
    ScoreBoardDetails
  );
});
