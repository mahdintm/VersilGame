import * as alt from "alt";
import * as native from "natives";

import { EventNames } from "../utils/eventNames";
import { WebViewStatus } from "../utils/WebViewStatus";
import { VGView } from "../views/webViewController";
import { ChangeValueFromVariable } from "./everyTick";

alt.on("keydown", async (key) => {
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

      VGView.isOpenKeyUPEmit(true);
      break;
    case 0x28:
      // Row Down pressed
      if (alt.isConsoleOpen()) return;
      if (native.isPauseMenuActive()) return;

      VGView.isOpenKeyUPEmit(false);
      break;
    case 0x25:
      // Row Left pressed
      if (alt.isConsoleOpen()) return;
      if (native.isPauseMenuActive()) return;

      VGView.isOpenKeyLeftEmit(true);
      break;
    case 0x27:
      // Row Right pressed
      if (alt.isConsoleOpen()) return;
      if (native.isPauseMenuActive()) return;

      VGView.isOpenKeyLeftEmit(false);
      break;
    case 0x41:
      // A Pressed
      if (alt.isConsoleOpen()) return;
      if (native.isPauseMenuActive()) return;
      if ((await VGView.getTopView()) != WebViewStatus.clothes.name) return;
      if (!VGView.isOpen(WebViewStatus.clothes.name)) return;

      ChangeValueFromVariable("KeyAOrDStatus", false);
      ChangeValueFromVariable("SetHeadingPedWithKeyUpStatus", true);
      break;
    case 0x44:
      // D Pressed
      if (alt.isConsoleOpen()) return;
      if (native.isPauseMenuActive()) return;
      if ((await VGView.getTopView()) != WebViewStatus.clothes.name) return;
      if (!VGView.isOpen(WebViewStatus.clothes.name)) return;

      ChangeValueFromVariable("KeyAOrDStatus", true);
      ChangeValueFromVariable("SetHeadingPedWithKeyUpStatus", true);
      break;
    case 0x57:
      // W Pressed
      if (alt.isConsoleOpen()) return;
      if (native.isPauseMenuActive()) return;
      if ((await VGView.getTopView()) != WebViewStatus.clothes.name) return;
      if (!VGView.isOpen(WebViewStatus.clothes.name)) return;

      ChangeValueFromVariable("KeyWOrSStatus", true);
      ChangeValueFromVariable("SetZRotCameraWithKeyWStatus", true);
      break;
    case 0x53:
      // S Pressed
      if (alt.isConsoleOpen()) return;
      if (native.isPauseMenuActive()) return;
      if ((await VGView.getTopView()) != WebViewStatus.clothes.name) return;
      if (!VGView.isOpen(WebViewStatus.clothes.name)) return;

      ChangeValueFromVariable("KeyWOrSStatus", false);
      ChangeValueFromVariable("SetZRotCameraWithKeyWStatus", true);
      break;
    case 0xbd:
      // - Pressed
      if (alt.isConsoleOpen()) return;
      if (native.isPauseMenuActive()) return;
      if ((await VGView.getTopView()) != WebViewStatus.clothes.name) return;
      if (!VGView.isOpen(WebViewStatus.clothes.name)) return;

      ChangeValueFromVariable("KeyZoomStatus", false);
      ChangeValueFromVariable("SetZoomCameraWithKeysStatus", true);
      break;
    case 0xbb:
      // + Pressed
      if (alt.isConsoleOpen()) return;
      if (native.isPauseMenuActive()) return;
      if ((await VGView.getTopView()) != WebViewStatus.clothes.name) return;
      if (!VGView.isOpen(WebViewStatus.clothes.name)) return;

      ChangeValueFromVariable("KeyZoomStatus", true);
      ChangeValueFromVariable("SetZoomCameraWithKeysStatus", true);
      break;
    case 0x12:
      // ALT pressed
      if (alt.isConsoleOpen()) return;
      if (native.isPauseMenuActive()) return;

      alt.emit(EventNames.eyeTracker.localClient.Manager, true);
      break;
    case 0x14:
      // CapsLock pressed
      if (alt.isConsoleOpen()) return;
      if (native.isPauseMenuActive()) return;

      alt.emit(EventNames.scoreBoard.localClient.ActiveScoreBoard, true);
      break;
  }
});
