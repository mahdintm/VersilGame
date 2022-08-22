/// <reference types="@altv/types-client" />
/// <reference types="@altv/types-natives" />
import * as alt from "alt-client";

import { EventNames } from "../utils/eventNames";

export function SendObjectTitlesToManageEyeTracker(ObjectTitles) {
  switch (ObjectTitles.action) {
    case "OpenClothesUiBox":
      alt.emit(EventNames.clothes.localClient.ActiveClothes)
      break;
    default:
      console.log(`Log From ${ObjectTitles.title} action`);
      break;
  }
}
