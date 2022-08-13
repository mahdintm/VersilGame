import * as alt from "alt-client";
import * as native from "natives";
import { EventNames } from "../utils/eventNames";

alt.onServer(EventNames.player.server.isFreezePlayer, (Status = true) => {
    native.freezeEntityPosition(alt.Player.local.scriptID, Status);
  });