import * as alt from "alt-server";
import { EventNames } from "../utils/eventNames";

alt.onClient(EventNames.player.client.StreamMeta.Vehicle.Cruise, (player, vehicle, key) => {
  vehicle.setStreamSyncedMeta(EventNames.player.client.StreamMeta.Vehicle.Cruise, key);
});
alt.onClient(EventNames.player.client.StreamMeta.Vehicle.Indicator, (player, vehicle, key) => {
  vehicle.setStreamSyncedMeta(EventNames.player.client.StreamMeta.Vehicle.Indicator, key);
});
alt.onClient(EventNames.player.client.StreamMeta.Vehicle.HandBrake, (player, vehicle, key) => {
  vehicle.setStreamSyncedMeta(EventNames.player.client.StreamMeta.Vehicle.HandBrake, key);
});
