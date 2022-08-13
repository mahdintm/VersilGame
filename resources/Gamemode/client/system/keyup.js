import * as alt from "alt";
import * as native from "natives";

import { EventNames } from "../utils/eventNames";
import { VGView } from "../views/webViewController";
alt.on("keyup", (key) => {
  switch (key) {
    //ServerOption
    case 0x32:
      //2
      if (alt.isConsoleOpen()) return;
      if (native.isPauseMenuActive()) return;

      alt.emit("Local:Vehicle:Engine");
      break;
    case 0x01:
      // Left Click Mouse pressed
      if (alt.isConsoleOpen()) return;
      if (native.isPauseMenuActive()) return;

      alt.emit("Local:eyeTracker:LeftClickMousePressed");
      break;
    case 0x1b:
      // ESC key pressed
      if (alt.isConsoleOpen()) return;
      if (native.isPauseMenuActive()) return;

      VGView.escPressed();
      break;
    case 0x12:
      // ALT pressed
      if (alt.isConsoleOpen()) return;
      if (native.isPauseMenuActive()) return;

      alt.emit("Local:eyeTracker", false);
      break;
  }
});
