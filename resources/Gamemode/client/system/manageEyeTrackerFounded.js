/// <reference types="@altv/types-client" />
/// <reference types="@altv/types-natives" />
import * as alt from "alt-client";
import * as native from "natives";
import { eyeTrackerObjects } from "../utils/eyeTrackerObjects";
function SelectActionObject(actionName) {}
export function SendObjectTitlesToManageEyeTracker(ObjectTitles) {
  switch (ObjectTitles.action) {
    case "OpenClothesUiBox":
      SelectActionObject(ObjectTitles.action);
      break;
    default:
      console.log(`Log From ${ObjectTitles.title} action`);
      break;
  }
}
