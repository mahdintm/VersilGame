/// <reference types="@altv/types-client" />
/// <reference types="@altv/types-natives" />
import * as alt from "alt-client";
import * as native from "natives";
import { view, PlayerController, View } from "./viewCreator";
import { ChangeValueFromVariable } from "../system/everyTick";
import { VGView } from "./webViewController";
import { WebViewStatus } from "../utils/WebViewStatus";
import { EventNames } from "../utils/eventNames";

alt.on("enteredVehicle", async () => {
  let playerVehicle = alt.Player.local.vehicle;
  SpeedOmeter(native.getIsVehicleEngineRunning(playerVehicle));
  VGView.load(WebViewStatus.speedOmeter.name);
  await VGView.emit(
    WebViewStatus.speedOmeter.name,
    "ClientWEB:Vehicle:Information",
    {
      Status: true,
      RPM: CalcVehicleRPM(0),
      Speed: 0,
      Fuel: 0,
      Engine: false,
      TransitionStatus: true,
    }
  );
});
alt.on("leftVehicle", async () => {
  SpeedOmeter(false);
  await VGView.emit(
    WebViewStatus.speedOmeter.name,
    "ClientWEB:Vehicle:Information",
    {
      Status: false,
      RPM: CalcVehicleRPM(0),
      Speed: 0,
      Fuel: 0,
      Engine: false,
      TransitionStatus: true,
    }
  );
  VGView.unload(WebViewStatus.speedOmeter.name);
});
alt.on("Local:Vehicle:EngineStatus", (Status) => {
  SpeedOmeter(Status);
});
async function SpeedOmeter(Status) {
  if (!Status) {
    await VGView.emit(
      WebViewStatus.speedOmeter.name,
      "ClientWEB:Vehicle:Information",
      {
        Status: true,
        RPM: CalcVehicleRPM(0),
        Speed: 0,
        Fuel: GetVehicleFuel(),
        Engine: false,
        TransitionStatus: false,
      }
    );
    ChangeValueFromVariable("VehicleSpeedOmeterInterval", false);
    return;
  }
  ChangeValueFromVariable("VehicleSpeedOmeterInterval", true);
}
export async function VehicleSpeedOmeter() {
  let playerVehicle = alt.Player.local.vehicle;
  if (playerVehicle == null) {
    ChangeValueFromVariable("VehicleSpeedOmeterInterval", false);
  }
  if (native.getIsVehicleEngineRunning(playerVehicle)) {
    await VGView.emit(
      WebViewStatus.speedOmeter.name,
      "ClientWEB:Vehicle:Information",
      {
        Status: true,
        RPM: CalcVehicleRPM(playerVehicle.rpm),
        Speed: Math.floor(playerVehicle.speed * 3.6),
        Fuel: GetVehicleFuel(),
        Engine: true,
        TransitionStatus: true,
      }
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
  if (rpm < 10) rpm = 10;
  if (rpm > 280) rpm = 280;
  LastRPM = rpm;
  return rpm;
  //  0 -> 10
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
