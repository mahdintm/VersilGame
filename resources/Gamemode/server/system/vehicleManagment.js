import * as alt from "alt-server";
import { EventNames } from "../utils/eventNames";

alt.onClient(EventNames.player.client.SeatBelt, (player) => {
  alt.emitClient(player, EventNames.player.server.SeatBelt, true);
});
alt.onClient(EventNames.player.client.Cruse, (player) => {
  alt.emitClient(player, EventNames.player.server.Cruse, true);
});
