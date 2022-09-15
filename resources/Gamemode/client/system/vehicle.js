// import { sendchat } from "../../server/system/chat"?
import * as native from "natives";
import * as alt from "alt";

function engine(state) {
  let playerVehicle = alt.Player.local.vehicle;
  if (playerVehicle == null) return;
  native.setVehicleEngineOn(playerVehicle, state, false, false);
  alt.emit("Local:Vehicle:EngineStatus", state);
}
alt.on("Local:Vehicle:Engine", () => {
  let playerVehicle = alt.Player.local.vehicle;
  if (playerVehicle == null || alt.Player.local.seat != 1) return;
  alt.emitServer("Client:Vehicle:Engine", playerVehicle, !playerVehicle.getSyncedMeta("engin_state"));
});
alt.onServer("Server:Vehicle:engin", engine);
