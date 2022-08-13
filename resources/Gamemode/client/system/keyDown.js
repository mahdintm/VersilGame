import * as alt from "alt";
import * as native from "natives";

import { EventNames } from "../utils/eventNames";
import { VGView } from "../views/webViewController";

alt.on("keydown", (key) => {
  switch (key) {
    //WebView
    case 0x54:
    case 0xc0:
      //T, ~ pressed
      if (alt.isConsoleOpen()) return;
      if (native.isPauseMenuActive()) return;

      alt.emit(EventNames.chat.localClient.KeyTPressed);
      break;
    case 0xbf:
      // Slash (/) pressed
      if (alt.isConsoleOpen()) return;
      if (native.isPauseMenuActive()) return;

      alt.emit(EventNames.chat.localClient.KeySlashPressed);
      break;
    case 0x21:
      // Page UP pressed
      if (alt.isConsoleOpen()) return;
      if (native.isPauseMenuActive()) return;

      alt.emit(EventNames.chat.localClient.KeyPageUpPressed);
      break;
    case 0x22:
      // Page Down pressed
      if (alt.isConsoleOpen()) return;
      if (native.isPauseMenuActive()) return;

      alt.emit(EventNames.chat.localClient.KeyPageDownPressed);
      break;
    case 0x26:
      // Row UP pressed
      if (alt.isConsoleOpen()) return;
      if (native.isPauseMenuActive()) return;

      alt.emit(EventNames.chat.localClient.KeyRowUpPressed);
      break;
    case 0x28:
      // Row Down pressed
      if (alt.isConsoleOpen()) return;
      if (native.isPauseMenuActive()) return;

      alt.emit(EventNames.chat.localClient.KeyRowDownPressed);
      break;

    case 0x12:
      // ALT pressed
      if (alt.isConsoleOpen()) return;
      if (native.isPauseMenuActive()) return;

      alt.emit("Local:eyeTracker", true);
      break;
  }
});
