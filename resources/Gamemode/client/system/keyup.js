import * as alt from "alt";
import * as native from "natives";

import { EventNames } from "../utils/eventNames";
import { VGView } from "../views/webViewController";
import { WebViewStatus } from "../utils/WebViewStatus";
import { ChangeValueFromVariable } from "./everyTick";
alt.on("keyup", async (key) => {
  switch (key) {
    //ServerOption
    case 0x32:
      //2
      if (alt.isConsoleOpen()) return;
      if (native.isPauseMenuActive()) return;
      if ((await VGView.getTopView()) == WebViewStatus.chat.name) return;

      alt.emit("Local:Vehicle:Engine");
      break;
    case 0x01:
      // Left Click Mouse pressed
      if (alt.isConsoleOpen()) return;
      if (native.isPauseMenuActive()) return;

      alt.emit(EventNames.eyeTracker.localClient.LeftClickMousePressed);
      break;
    case 0x1b:
      // ESC key pressed
      if (alt.isConsoleOpen()) return;
      if (native.isPauseMenuActive()) return;

      VGView.escPressed();
      break;
    case 0x41:
      // A Pressed
      if (alt.isConsoleOpen()) return;
      if (native.isPauseMenuActive()) return;
      if ((await VGView.getTopView()) != WebViewStatus.clothes.name) return;
      if (!VGView.isOpen(WebViewStatus.clothes.name)) return;

      ChangeValueFromVariable("KeyAOrDStatus", false);
      ChangeValueFromVariable("SetHeadingPedWithKeyUpStatus", false);
      break;
    case 0x44:
      // D Pressed
      if (alt.isConsoleOpen()) return;
      if (native.isPauseMenuActive()) return;
      if ((await VGView.getTopView()) != WebViewStatus.clothes.name) return;
      if (!VGView.isOpen(WebViewStatus.clothes.name)) return;

      ChangeValueFromVariable("KeyAOrDStatus", false);
      ChangeValueFromVariable("SetHeadingPedWithKeyUpStatus", false);
      break;
    case 0x57:
      // W Pressed
      if (alt.isConsoleOpen()) return;
      if (native.isPauseMenuActive()) return;
      if ((await VGView.getTopView()) != WebViewStatus.clothes.name) return;
      if (!VGView.isOpen(WebViewStatus.clothes.name)) return;

      ChangeValueFromVariable("KeyWOrSStatus", false);
      ChangeValueFromVariable("SetZRotCameraWithKeyWStatus", false);
      break;
    case 0x53:
      // S Pressed
      if (alt.isConsoleOpen()) return;
      if (native.isPauseMenuActive()) return;
      if ((await VGView.getTopView()) != WebViewStatus.clothes.name) return;
      if (!VGView.isOpen(WebViewStatus.clothes.name)) return;

      ChangeValueFromVariable("KeyWOrSStatus", false);
      ChangeValueFromVariable("SetZRotCameraWithKeyWStatus", false);
      break;
    case 0xbd:
      // - Pressed
      if (alt.isConsoleOpen()) return;
      if (native.isPauseMenuActive()) return;
      if ((await VGView.getTopView()) != WebViewStatus.clothes.name) return;
      if (!VGView.isOpen(WebViewStatus.clothes.name)) return;

      ChangeValueFromVariable("KeyZoomStatus", false);
      ChangeValueFromVariable("SetZoomCameraWithKeysStatus", false);
      break;
    case 0xbb:
      // + Pressed
      if (alt.isConsoleOpen()) return;
      if (native.isPauseMenuActive()) return;
      if ((await VGView.getTopView()) != WebViewStatus.clothes.name) return;
      if (!VGView.isOpen(WebViewStatus.clothes.name)) return;

      ChangeValueFromVariable("KeyZoomStatus", false);
      ChangeValueFromVariable("SetZoomCameraWithKeysStatus", false);
      break;
    case 0x12:
      // ALT pressed
      if (alt.isConsoleOpen()) return;
      if (native.isPauseMenuActive()) return;

      alt.emit(EventNames.eyeTracker.localClient.Manager, false);
      break;
    case 0x14:
      // CapsLock pressed
      alt.emit(EventNames.scoreBoard.localClient.ActiveScoreBoard, false);
      break;
  }
});
