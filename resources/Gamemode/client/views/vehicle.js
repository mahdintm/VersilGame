/// <reference types="@altv/types-client" />
/// <reference types="@altv/types-natives" />
import * as alt from "alt-client";
import * as native from "natives";
import { ChangeValueFromVariable } from "../system/everyTick";
import { VGView } from "./webViewController";
import { WebViewStatus } from "../utils/WebViewStatus";
import { EventNames } from "../utils/eventNames";
import { VGHUD } from "./HUD";
import { VG } from "../system/functions";

alt.on("enteredVehicle", () => {
  let playerVehicle = alt.Player.local.vehicle;
  SpeedOmeter(native.getIsVehicleEngineRunning(playerVehicle));
});
alt.on("leftVehicle", () => {
  VGHUD.VehicleSpeedOmeter({ isActiveCarHud: false });
});
alt.on("Local:Vehicle:EngineStatus", (Status) => {
  SpeedOmeter(Status);
});
function SpeedOmeter(Status) {
  if (!Status) {
    VGHUD.VehicleSpeedOmeter({
      isActiveCarHud: true,
      RPM: 0,
      Speed: 0,
      Fuel: GetVehicleFuel(),
      Engine: false,
    });

    ChangeValueFromVariable("VehicleSpeedOmeterInterval", false);
    return;
  }
  ChangeValueFromVariable("VehicleSpeedOmeterInterval", true);
}

let isSeatBelt = false,
  isCruse = false,
  isLongLights = false,
  isLights = false,
  isHandBrake = false,
  isLeftGuide = false,
  isRightGuide = false,
  isPairGuide = false;

export async function VehicleSpeedOmeter() {
  let playerVehicle = alt.Player.local.vehicle;
  if (playerVehicle == null) {
    return ChangeValueFromVariable("VehicleSpeedOmeterInterval", false);
  }
  if (native.getIsVehicleEngineRunning(playerVehicle)) {
    // VG.serverLog(playerVehicle.gear);
    // console.log(playerVehicle.maxGear);
    VGHUD.VehicleSpeedOmeter({
      isActiveCarHud: true,
      RPM: parseInt(playerVehicle.rpm * 370),
      Speed: Math.floor(native.getEntitySpeed(playerVehicle) * 3.6),
      Fuel: GetVehicleFuel(),
      Engine: true,
      isSeatBelt: isSeatBelt,
      isCruse: isCruse,
      isLongLights: isLongLights,
      isLights: isLights,
      isHandBrake: isHandBrake,
      isLeftGuide: isLeftGuide,
      isRightGuide: isRightGuide,
      isPairGuide: isPairGuide,
    });
  }
}
function GetVehicleFuel() {
  try {
    return alt.Player.local.vehicle.getSyncedMeta("fuel");
  } catch (error) {
    return 0;
  }
}
