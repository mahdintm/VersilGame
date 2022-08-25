import * as alt from "alt";
import { EventNames } from "../utils/eventNames";

alt.emitClient(player, EventNames.player.server.Add3DText, {
  Department: "House",
  id: 0,
  Text: "Test Text",
  x: 0,
  y: 0,
  z: 0,
});

alt.emitClient(player, EventNames.player.server.Remove3DText, {
  Department: "House",
  id: 0,
});

alt.emitClient(player, EventNames.player.server.Modify3DText, {
  Department: "House",
  id: 0,
  Text: "Test Text",
  x: 0,
  y: 0,
  z: 0,
});
