import * as alt from "alt";
import * as native from "natives";

import { EveryTickEvents } from "./event";
import { VehicleSpeedOmeter } from "../views/vehicle";
import {
  eyeTracker,
  GetObject,
  InternalEyeTrackerChecker,
  DisableLeftClickControlAction,
} from "../views/eyeTracker";

let eyeTragerInterval = false,
  VehicleSpeedOmeterInterval = false,
  eyeTragerInternalInterval = undefined,
  disableLeftClickControlAction = false;

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
  }
}

alt.everyTick(() => {
  EveryTickEvents();
  //   GetObject();
  if (VehicleSpeedOmeterInterval) VehicleSpeedOmeter();
  if (eyeTragerInterval) eyeTracker();

  if (eyeTragerInternalInterval != undefined)
    InternalEyeTrackerChecker(eyeTragerInternalInterval);

  if (disableLeftClickControlAction) {
    DisableLeftClickControlAction();
  }
});
