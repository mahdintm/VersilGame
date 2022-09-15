/// <reference types="@altv/types-natives" />
import * as alt from "alt-client";

import { VGView } from "./webViewController";
import { LocalStorage } from "../system/LocalStorage";
import { EventNames } from "../utils/eventNames";
import { WebViewStatus } from "../utils/WebViewStatus";
import { ChangeValueFromVariable } from "../system/everyTick";
import { VG } from "../system/functions";

alt.on(EventNames.allVue.localClient.loadWebviews, async () => {
  VGView.load(WebViewStatus.HUD.name);
  ChangeValueFromVariable("isHUDActived", true);
});

let CashHUDDetails = {
    isActiveCashHUD: undefined,
    playerCash: undefined,
    playerJob: undefined,
  },
  RadarVeniceHUD = {
    isActiveRadarVenice: undefined,
    ServerTime: undefined,
    PlayerName: undefined,
    isMicOn: undefined,
    HealthValue: undefined,
    HungerValue: undefined,
    ArmorValue: undefined,
    ThirstyValue: undefined,
  };
export class VGHUD {
  static PlayerCash(Details) {
    // Check Format Object
    if (Details.isActiveCashHUD == undefined) Details.isActiveCashHUD = false;
    if (Details.playerCash == undefined) Details.playerCash = 0;
    if (Details.playerJob == undefined) Details.playerJob = null;

    // is Values Changed
    let isChanged = false;
    if (Details.isActiveCashHUD != CashHUDDetails.isActiveCashHUD) {
      CashHUDDetails.isActiveCashHUD = Details.isActiveCashHUD;
      isChanged = true;
    }
    if (Details.playerCash != CashHUDDetails.playerCash) {
      CashHUDDetails.playerCash = Details.playerCash;
      isChanged = true;
    }
    if (Details.playerJob != CashHUDDetails.playerJob) {
      CashHUDDetails.playerJob = Details.playerJob;
      isChanged = true;
    }

    if (isChanged) VGView.emit(WebViewStatus.HUD.name, EventNames.HUD.clientWEB.SetPlayerCashDetails, CashHUDDetails);
  }
  static RadarVeniceHUD(Details) {
    if (!Details.isActiveRadarVenice) {
      if (Details.isActiveRadarVenice == undefined) Details.isActiveRadarVenice = false;
      return VGView.emit(WebViewStatus.HUD.name, EventNames.HUD.clientWEB.SetCarHUDDetails, { isActiveRadarVenice: false });
    }

    // Check For current Format
    if (Details.ServerTime == undefined) Details.ServerTime = "00:00";
    if (Details.PlayerName == undefined) Details.PlayerName = "";
    if (Details.isMicOn == undefined) Details.isMicOn = false;
    if (Details.HealthValue == undefined) Details.HealthValue = 0; // 0 - 100
    if (Details.HungerValue == undefined) Details.HungerValue = 0; // 0 - 100
    if (Details.ArmorValue == undefined) Details.ArmorValue = 0; // 0 - 100
    if (Details.ThirstyValue == undefined) Details.ThirstyValue = 0; // 0 - 100

    // is Values Changed
    let isChanged = false;
    if (Details.ServerTime != RadarVeniceHUD.ServerTime) {
      RadarVeniceHUD.ServerTime = Details.ServerTime;
      isChanged = true;
    }

    if (Details.PlayerName != RadarVeniceHUD.PlayerName) {
      RadarVeniceHUD.PlayerName = Details.PlayerName;
      isChanged = true;
    }
    if (Details.isMicOn != RadarVeniceHUD.isMicOn) {
      RadarVeniceHUD.isMicOn = Details.isMicOn;
      isChanged = true;
    }
    if (Details.HealthValue != RadarVeniceHUD.HealthValue) {
      RadarVeniceHUD.HealthValue = Details.HealthValue;
      isChanged = true;
    }
    if (Details.HungerValue != RadarVeniceHUD.HungerValue) {
      RadarVeniceHUD.HungerValue = Details.HungerValue;
      isChanged = true;
    }
    if (Details.ArmorValue != RadarVeniceHUD.ArmorValue) {
      RadarVeniceHUD.ArmorValue = Details.ArmorValue;
      isChanged = true;
    }
    if (Details.ThirstyValue != RadarVeniceHUD.ThirstyValue) {
      RadarVeniceHUD.ThirstyValue = Details.ThirstyValue;
      isChanged = true;
    }

    // Set Values for View
    Details.HealthValue *= 1.6;
    Details.HungerValue *= 1.6;
    Details.ArmorValue *= 1.6;
    Details.ThirstyValue *= 1.6;

    if (isChanged) VGView.emit(WebViewStatus.HUD.name, EventNames.HUD.clientWEB.SetVeniceHUDDetails, Details);
  }
  static VehicleSpeedOmeter(Details) {
    if (Details.isActiveCarHud == undefined) Details.isActiveCarHud = false;

    if (!Details.isActiveCarHud) {
      return VGView.emit(WebViewStatus.HUD.name, EventNames.HUD.clientWEB.SetCarHUDDetails, { isActiveCarHud: false });
    }

    // Check For current Format
    if (Details.RPM == undefined) Details.RPM = 0;
    if (Details.Speed == undefined) Details.Speed = 0;
    if (Details.Fuel == undefined) Details.Fuel = 0;
    if (Details.Engine == undefined) Details.Engine = false;
    if (Details.isHighRPM == undefined) Details.isHighRPM = false;
    if (Details.isSeatBelt == undefined) Details.isSeatBelt = false;
    if (Details.isCruse == undefined) Details.isCruse = false;
    if (Details.isLongLights == undefined) Details.isLongLights = false;
    if (Details.isLights == undefined) Details.isLights = false;
    if (Details.isHandBrake == undefined) Details.isHandBrake = false;
    if (Details.isLeftGuide == undefined) Details.isLeftGuide = false;
    if (Details.isRightGuide == undefined) Details.isRightGuide = false;
    if (Details.isPairGuide == undefined) Details.isPairGuide = false;

    if (Details.GearValue == undefined) Details.GearValue = "P";
    if (Details.isGearUP == undefined) Details.isGearUP = false;

    VGView.emit(WebViewStatus.HUD.name, EventNames.HUD.clientWEB.SetCarHUDDetails, Details);
  }
}

export function EveryTickForHUD() {
  VGHUD.PlayerCash({
    isActiveCashHUD: true,
    playerCash: 200000000000,
    playerJob: undefined,
  });
  VGHUD.RadarVeniceHUD({
    isActiveRadarVenice: true,
    ServerTime: "12:00",
    PlayerName: "Toofan123456789",
    isMicOn: true,
    HealthValue: 50,
    HungerValue: 100,
    ArmorValue: 50,
    ThirstyValue: 100,
  });
}
