import * as alt from "alt";
import { EveryTickEvents } from "./event";
import { VehicleSpeedOmeter } from "../views/vehicle";
import {
  eyeTracker,
  GetObject,
  InternalEyeTrackerChecker,
} from "../views/eyeTracker";

let eyeTragerInterval = false,
  VehicleSpeedOmeterInterval = false,
  eyeTragerInternalInterval = undefined;

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
  }
  return;
}

alt.everyTick(() => {
  EveryTickEvents();
  //   GetObject();
  if (VehicleSpeedOmeterInterval) VehicleSpeedOmeter();
  if (eyeTragerInterval) eyeTracker();

  if (eyeTragerInternalInterval != undefined)
    InternalEyeTrackerChecker(eyeTragerInternalInterval);
});
