/// <reference types="@altv/types-natives" />
import * as alt from "alt-client";

import { VGView } from "./webViewController";
import { LocalStorage } from "../system/LocalStorage";
import { EventNames } from "../utils/eventNames";
import { WebViewStatus } from "../utils/WebViewStatus";

alt.on(EventNames.allVue.localClient.loadWebviews, async () => {
  VGView.load(WebViewStatus.HUD.name);

  const CarHUDDetails = {
    isActiveCarHud: true,

    RPM: 10,
    Speed: 0,
    fuel: 100,
    isSeatBelt: false,
    isCruse: false,
    isLongLights: false,
    isLights: false,
    isHandBrake: false,
    isLeftGuide: false,
    isRightGuide: false,
    isPairGuide: false,
  };

  const CashHUDDetails = {
    isActiveCashHUD: true,
    playerCash: 200000000000,
    playerJob: undefined,
  };

  VGView.emit(
    WebViewStatus.HUD.name,
    EventNames.HUD.clientWEB.SetPlayerCashDetails,
    CashHUDDetails
  );
});

export class VGHUD {
  static VehicleSpeedOmeter(Details) {
    if (!Details.isActiveCarHud) {
      return VGView.emit(
        WebViewStatus.HUD.name,
        EventNames.HUD.clientWEB.SetCarHUDDetails,
        { isActiveCarHud: false }
      );
    }

    // Check For current Format
    if (Details.RPM == undefined) Details.RPM = 0;
    if (Details.Speed == undefined) Details.Speed = 0;
    if (Details.Fuel == undefined) Details.Fuel = 0;
    if (Details.Engine == undefined) Details.Engine = false;
    if (Details.isSeatBelt == undefined) Details.isSeatBelt = false;
    if (Details.isCruse == undefined) Details.isCruse = false;
    if (Details.isLongLights == undefined) Details.isLongLights = false;
    if (Details.isLights == undefined) Details.isLights = false;
    if (Details.isHandBrake == undefined) Details.isHandBrake = false;
    if (Details.isLeftGuide == undefined) Details.isLeftGuide = false;
    if (Details.isRightGuide == undefined) Details.isRightGuide = false;
    if (Details.isPairGuide == undefined) Details.isPairGuide = false;

    VGView.emit(
      WebViewStatus.HUD.name,
      EventNames.HUD.clientWEB.SetCarHUDDetails,
      Details
    );
  }
}
