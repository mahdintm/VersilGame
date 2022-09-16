import * as alt from "alt-client";
import { EventNames } from "../utils/eventNames";
import { ChangeVehicleHUDVariable } from "../views/vehicle";

alt.on("streamSyncedMetaChange", (entity, key, newValue, oldValue) => {
  switch (key) {
    case EventNames.player.client.StreamMeta.Vehicle.Indicator:
      if (entity.hasStreamSyncedMeta(key)) {
        entity.indicatorLights = newValue;
        if (newValue == 0) {
          ChangeVehicleHUDVariable("isLeftGuide", false);
          ChangeVehicleHUDVariable("isRightGuide", false);
        }
        if (newValue == 1) ChangeVehicleHUDVariable("isLeftGuide", true);
        if (newValue == 2) ChangeVehicleHUDVariable("isRightGuide", true);
      }
      break;
    case EventNames.player.client.StreamMeta.Vehicle.Cruise:
      if (entity.hasStreamSyncedMeta(key)) {
        ChangeVehicleHUDVariable("isCruse", newValue);
      }
      break;
    case EventNames.player.client.StreamMeta.Vehicle.HandBrake:
      if (entity.hasStreamSyncedMeta(key)) {
        ChangeVehicleHUDVariable("isHandBrake", newValue);
      }
      break;
  }
});
