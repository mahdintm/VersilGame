/// <reference types="@altv/types-client" />
/// <reference types="@altv/types-natives" />
import * as alt from "alt-client";
import * as native from "natives";
import { ChangeValueFromVariable } from "../system/everyTick";
import { VG } from "../system/functions";
import { EventNames } from "../utils/eventNames";
import { VGHUD } from "./HUD";

let isSeatBelt = false,
  isHighRPM = false,
  isCruse = false,
  isHandBrake = false,
  isLeftGuide = false,
  isRightGuide = false,
  VehicleCruiseSpeed = 0,
  lastGear = "P";

alt.on("enteredVehicle", () => {
  let playerVehicle = alt.Player.local.vehicle;
  SpeedOmeter(native.getIsVehicleEngineRunning(playerVehicle));
});
alt.on("leftVehicle", () => {
  SpeedOmeter(false, true);
  isSeatBelt = false;
  isHighRPM = false;
  isCruse = false;
  isHandBrake = false;
  isLeftGuide = false;
  isRightGuide = false;
  VehicleCruiseSpeed = 0;
  lastGear = "P";
});
alt.on("Local:Vehicle:EngineStatus", (Status) => {
  SpeedOmeter(Status);
});
function SpeedOmeter(Status, isHide = false) {
  if (alt.Player.local.vehicle == null) isHide = true;
  if (!Status) {
    ChangeValueFromVariable("VehicleSpeedOmeterInterval", false);
    isHide
      ? VGHUD.VehicleSpeedOmeter({ isActiveCarHud: false })
      : VGHUD.VehicleSpeedOmeter({
          isActiveCarHud: true,
          RPM: 0,
          Speed: 0,
          Fuel: GetVehicleFuel(),
          Engine: false,
        });
    return;
  }
  ChangeValueFromVariable("VehicleSpeedOmeterInterval", true);
}

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
      RPM: GetVehicleRPM(),
      Speed: Math.floor(native.getEntitySpeed(playerVehicle) * 3.6),
      Fuel: GetVehicleFuel(),
      Engine: true,
      isHighRPM: isHighRPM,
      isSeatBelt: isSeatBelt,
      isCruse: GetCruiseStatus(),
      isLongLights: GetLongLightsStatus(),
      isLights: GetLightsStatus(),
      isHandBrake: isHandBrake,
      isLeftGuide: isLeftGuide,
      isRightGuide: isRightGuide,
      GearValue: GetGear(),
      isGearUP: isGearUP(),
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
function GetLightsStatus() {
  try {
    if (
      native.getVehicleLightsState(alt.Player.local.vehicle, true, true)[1] == 1
    ) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
}
function GetLongLightsStatus() {
  try {
    if (
      native.getVehicleLightsState(alt.Player.local.vehicle, true, true)[2] == 1
    ) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
}

function GetVehicleRPM() {
  try {
    let RPM = alt.Player.local.vehicle.rpm * 370;
    if (RPM > 368) RPM = 372.8;

    RPM > 350 ? (isHighRPM = true) : (isHighRPM = false);
    return RPM;
  } catch (error) {
    return 0;
  }
}

function IndicatorManager(isLeftIndicator) {
  // BlinkLeft = 1,
  // BlinkRight = 2,
  // BlinkPermBoth = 4,
  // StaticBoth = 8,
  // Interior = 64,
  if (alt.Player.local.vehicle == null) return;
  if (alt.Player.local.seat != 1) return;

  if (isLeftIndicator) {
    isRightGuide = false;
    isLeftGuide = !isLeftGuide;
    if (!isLeftGuide) {
      alt.emitServer("Vehicle:IndicatorChange", alt.Player.local.vehicle, 0);
    } else {
      alt.emitServer("Vehicle:IndicatorChange", alt.Player.local.vehicle, 1);
    }
  } else {
    isLeftGuide = false;
    isRightGuide = !isRightGuide;
    if (!isRightGuide) {
      alt.emitServer("Vehicle:IndicatorChange", alt.Player.local.vehicle, 0);
    } else {
      alt.emitServer("Vehicle:IndicatorChange", alt.Player.local.vehicle, 2);
    }
  }
}

function GetGear() {
  const gear = alt.Player.local.vehicle.gear;
  if (
    GetVehicleRPM() >= 75 &&
    Math.floor(native.getEntitySpeed(alt.Player.local.vehicle) * 3.6) == 0 &&
    isHandBrake == true
  )
    return "N";

  if (
    GetVehicleRPM() >= 75 &&
    Math.floor(native.getEntitySpeed(alt.Player.local.vehicle) * 3.6) == 0 &&
    isHandBrake == false
  )
    return 1;

  if (Math.floor(native.getEntitySpeed(alt.Player.local.vehicle) * 3.6) == 0) {
    return "P";
  }

  if (gear == 0) return "R";
  return gear;
}

function isGearUP() {
  const gear = GetGear();
  if (gear != lastGear) {
    if (gear == "R") {
      lastGear = gear;
      return false;
    }
    if (gear == "P" && lastGear == "R") {
      lastGear = gear;
      return true;
    }
    if (gear == "P" && lastGear == 1) {
      lastGear = gear;
      return false;
    }
    if (gear == 1 && lastGear == "P") {
      lastGear = gear;
      return true;
    }
    if (gear == 1 && lastGear == "R") {
      lastGear = gear;
      return true;
    }
    if (gear == 1 && lastGear == "N") {
      lastGear = gear;
      return true;
    }
    if (gear == "N" && lastGear == "P") {
      lastGear = gear;
      return true;
    }
    if (gear == "P" && lastGear == "N") {
      lastGear = gear;
      return false;
    }
    if (gear > lastGear) {
      lastGear = gear;
      return true;
    }
    lastGear = gear;
    return false;
  } else {
    return "NotChanged";
  }
}

function SeatBeltRequest() {
  if (alt.Player.local.vehicle == null) return;
  // if (alt.Player.local.seat != 1) return;
  alt.emitServer(EventNames.player.client.SeatBelt);
}

function GetCruiseStatus() {
  if (alt.Player.local.vehicle == null) return;
  if (isCruse) {
    if (
      Math.floor(native.getEntitySpeed(alt.Player.local.vehicle) * 3.6) >=
        Math.floor(VehicleCruiseSpeed * 3.6) - 2 &&
      Math.floor(native.getEntitySpeed(alt.Player.local.vehicle) * 3.6) <=
        Math.floor(VehicleCruiseSpeed * 3.6) + 2 &&
      !isHandBrake
    ) {
      native.setVehicleForwardSpeed(
        alt.Player.local.vehicle,
        VehicleCruiseSpeed
      );
    } else {
      isCruse = false;
    }
  }

  return isCruse;
}
function CruseRequest() {
  // alt.emitServer(EventNames.player.client.Cruse);
  if (alt.Player.local.vehicle == null) return;
  if (alt.Player.local.seat != 1) return;

  VehicleCruiseSpeed = Math.floor(
    native.getEntitySpeed(alt.Player.local.vehicle)
  );
  isCruse = !isCruse;
}

alt.on(EventNames.HUD.localClient.HandBrake, (Status) => {
  if (alt.Player.local.vehicle == null) return;
  if (alt.Player.local.seat != 1) return;
  isHandBrake = Status;
});
alt.on(EventNames.HUD.localClient.IndicatorLeft, () => {
  IndicatorManager(true);
});
alt.on(EventNames.HUD.localClient.IndicatorRight, () => {
  IndicatorManager(false);
});
alt.on(EventNames.HUD.localClient.SeatBelt, SeatBeltRequest);
alt.on(EventNames.HUD.localClient.Cruse, CruseRequest);

alt.onServer(EventNames.player.server.SeatBelt, (Status) => {
  if (alt.Player.local.vehicle == null) return;

  isSeatBelt = Status;
});
alt.onServer(EventNames.player.server.Cruse, (Status) => {});
