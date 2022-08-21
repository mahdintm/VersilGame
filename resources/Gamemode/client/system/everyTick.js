import * as alt from "alt";
import * as native from "natives";

import { EveryTickEvents } from "./event";
import { VehicleSpeedOmeter } from "../views/vehicle";
import { VGEyeTracker } from "../views/eyeTracker";
import { VGPeds } from "./peds";
import { ClothesDetails } from "../utils/ClothesDetails";
import { VGCameraClothes } from "../views/cameraClothes";
import { GetScoreBoardDetails } from "../views/scoreBoard";

let eyeTragerInterval = false,
  VehicleSpeedOmeterInterval = false,
  eyeTragerInternalInterval = undefined,
  disableLeftClickControlAction = false,
  SetHeadingPedWithKeyUpStatus = false,
  KeyAOrDStatus = false,
  SetZRotCameraWithKeyWStatus = false,
  KeyWOrSStatus = false,
  SetZoomCameraWithKeysStatus = false,
  KeyZoomStatus = false,
  ScoreBoardStatus = false;

export function ChangeValueFromVariable(Variable, Value) {
  switch (Variable) {
    case "eyeTragerInterval":
      eyeTragerInterval = Value;
      break;
    case "eyeTragerInternalInterval":
      eyeTragerInternalInterval = Value;
      break;
    case "VehicleSpeedOmeterInterval":
      VehicleSpeedOmeterInterval = Value;
      break;
    case "disableLeftClickControlAction":
      disableLeftClickControlAction = Value;
      break;
    case "SetHeadingPedWithKeyUpStatus":
      SetHeadingPedWithKeyUpStatus = Value;
      break;
    case "KeyAOrDStatus":
      KeyAOrDStatus = Value;
      break;
    case "SetZRotCameraWithKeyWStatus":
      SetZRotCameraWithKeyWStatus = Value;
      break;
    case "KeyWOrSStatus":
      KeyWOrSStatus = Value;
      break;
    case "SetZoomCameraWithKeysStatus":
      SetZoomCameraWithKeysStatus = Value;
      break;
    case "KeyZoomStatus":
      KeyZoomStatus = Value;
      break;
    case "ScoreBoardStatus":
      ScoreBoardStatus = Value;
      break;
  }
}
let lastSecond = null;
alt.everyTick(() => {
  EveryTickEvents();
  // VGEyeTracker.GetObject();
  if (VehicleSpeedOmeterInterval) VehicleSpeedOmeter();
  if (eyeTragerInterval) VGEyeTracker.eyeTracker();

  if (eyeTragerInternalInterval != undefined)
    VGEyeTracker.InternalEyeTrackerChecker(eyeTragerInternalInterval);

  if (disableLeftClickControlAction) {
    VGEyeTracker.DisableLeftClickControlAction();
  }
  if (SetHeadingPedWithKeyUpStatus) {
    VGPeds.SetHeadingPedWithKeyUp(
      ClothesDetails.ClothesPreviewNPCs.name,
      KeyAOrDStatus
    );
  }
  if (SetZRotCameraWithKeyWStatus && !SetZoomCameraWithKeysStatus) {
    VGCameraClothes.GoUP(KeyWOrSStatus);
  }
  if (SetZoomCameraWithKeysStatus && !SetZRotCameraWithKeyWStatus) {
    VGCameraClothes.ZoomCamera(KeyZoomStatus);
  }
  // console.log(native.getInteriorFromEntity(alt.Player.local.scriptID));

  const timeNow = new Date();
  const nowHoure = timeNow.getHours();
  const nowMinute = timeNow.getMinutes();
  const nowSecond = timeNow.getSeconds();
  //rase har saat
  if (nowMinute < 1 && nowSecond < 1) {
    //rase har 24saat
    if (nowHoure == 24) {
    }
    //rase har saat
  }
  //rase har daqiqe
  if (nowSecond < 1) {
  }
  if (lastSecond != nowSecond) {
    //rase har sanie
    if (ScoreBoardStatus) {
      console.log(lastSecond);
      GetScoreBoardDetails();
    }
  }
  lastSecond = nowSecond;
});

// setInterval(() => {
//   console.log("Ping:", alt.getPing());
//   console.log("FPS:", alt.getFps());
// }, 2000);
