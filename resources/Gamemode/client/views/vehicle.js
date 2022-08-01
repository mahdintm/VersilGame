/// <reference types="@altv/types-client" />
/// <reference types="@altv/types-natives" />
import * as alt from "alt-client";
import * as native from "natives";
import { view, PlayerController, View } from "./viewCreator";
import { ChangeValueFromVariable } from "../system/everyTick";
alt.on("enteredVehicle", () => {
  let playerVehicle = alt.Player.local.vehicle;
  SpeedOmeter(native.getIsVehicleEngineRunning(playerVehicle));
  view.emit("ClientWEB:Vehicle:Information", true);
});
alt.on("leftVehicle", () => {
  SpeedOmeter(false);
  view.emit("ClientWEB:Vehicle:Information", false);
});
alt.on("Local:Vehicle:EngineStatus", (Status) => {
  SpeedOmeter(Status);
});
function SpeedOmeter(Status) {
  if (!Status) {
    view.emit(
      "ClientWEB:Vehicle:Information",
      true,
      CalcVehicleRPM(0),
      0,
      GetVehicleFuel(),
      false, // Engine
      false // Transition 1s for Engine off
    );
    ChangeValueFromVariable("VehicleSpeedOmeterInterval", false);
    return;
  }
  ChangeValueFromVariable("VehicleSpeedOmeterInterval", true);
}
export function VehicleSpeedOmeter() {
  let playerVehicle = alt.Player.local.vehicle;
  if (playerVehicle == null) {
    ChangeValueFromVariable("VehicleSpeedOmeterInterval", false);
  }
  if (native.getIsVehicleEngineRunning(playerVehicle)) {
    view.emit(
      "ClientWEB:Vehicle:Information",
      true,
      CalcVehicleRPM(playerVehicle.rpm),
      Math.floor(playerVehicle.speed * 3.6),
      GetVehicleFuel(),
      true
    );
  }
}
function GetVehicleFuel() {
  try {
    return alt.Player.local.vehicle.getSyncedMeta("fuel");
  } catch (error) {
    return 0;
  }
}

let LastRPM;
function CalcVehicleRPM(rpm) {
  rpm = parseInt(rpm * 100) * 3;
  if (rpm == 300) {
    if (LastRPM == 280) {
      rpm = 275;
    } else {
      rpm = 280;
    }
  }
  if (rpm < 13) rpm = 13;
  if (rpm > 280) rpm = 280;
  LastRPM = rpm;
  return rpm;
  //  0 -> 13
  //  1 -> 38
  //  2 -> 64
  //  3 -> 90
  //  4 -> 116
  //  5 -> 142
  //  6 -> 168
  //  7 -> 198
  //  8 -> 226
  //  9 -> 252
  //  10 -> 275 - 280
}
