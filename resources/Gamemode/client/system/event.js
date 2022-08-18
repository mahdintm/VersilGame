import * as alt from "alt-client";
import * as native from "natives";
import { LocalStorage } from "./LocalStorage";
import { LoadLoginPage } from "../views/login";
import { EventNames } from "../utils/eventNames";

alt.on("connectionComplete", ConnectionComplet);

export function EveryTickEvents() {
  native.setPedConfigFlag(alt.Player.local.scriptID, 184, true);
  // native.disableControlAction(0, 23, true)
  native.setPedConfigFlag(alt.Player.local.scriptID, 429, true); //disable auto start engine vehicles
  native.setPedConfigFlag(alt.Player.local.scriptID, 241, true); //disable auto stop engine vehicles
  native.hideHudComponentThisFrame(6); // For disable vehicle name
  native.hideHudComponentThisFrame(7); // For disable area name
  native.hideHudComponentThisFrame(9); // For disable street name
}

async function ConnectionComplet(player) {
  if ((await LocalStorage.get("WebLanguage")) == null)
    LocalStorage.set("WebLanguage", "en");
  if ((await LocalStorage.get("WebDarkMode")) == null)
    LocalStorage.set("WebDarkMode", false);
  if ((await LocalStorage.get("Remember")) == null)
    LocalStorage.set("Remember", false);
  if ((await LocalStorage.get("Chat_TimeStamp")) == null)
    await LocalStorage.set("Chat_TimeStamp", false);
  alt.emitServer("SyncData_LOCAL", {
    // DiscordID: alt.Discord.currentUser.id,
    Language: await LocalStorage.get("WebLanguage"),
  });

  LoadLoginPage(); //for load web view login page
  // alt.beginScaleformMovieMethodMinimap("SETUP_HEALTH_ARMOUR"); // hiding health and armour bars without abusing everyTick
  // native.scaleformMovieMethodAddParamInt(3); // hiding health and armour bars without abusing everyTick
  // native.endScaleformMovieMethod(); // hiding health and armour bars without abusing everyTick
  alt.setConfigFlag("DISABLE_IDLE_CAMERA", true); // For disable IDLE camera
  native.destroyAllCams(true);
  native.renderScriptCams(false, false, 0, false, false, 0);
  native.doScreenFadeIn(0);
  native.triggerScreenblurFadeOut(0);
  native.freezeEntityPosition(alt.Player.local.scriptID, false);
  native.startAudioScene(`CHARACTER_CHANGE_IN_SKY_SCENE`);
  native.startAudioScene("FBI_HEIST_H5_MUTE_AMBIENCE_SCENE"); // Used to stop police sound in town
  native.cancelCurrentPoliceReport(); // Used to stop default police radio around/In police vehicle
  native.clearAmbientZoneState(
    "AZ_COUNTRYSIDE_PRISON_01_ANNOUNCER_GENERAL",
    false
  ); // Turn off prison sound
  native.clearAmbientZoneState(
    "AZ_COUNTRYSIDE_PRISON_01_ANNOUNCER_WARNING",
    false
  ); // Turn off prison sound
  native.clearAmbientZoneState(
    "AZ_COUNTRYSIDE_PRISON_01_ANNOUNCER_ALARM",
    false
  ); // Turn off prison sound
  native.setAmbientZoneState("", false, false);
  native.clearAmbientZoneState("AZ_DISTANT_SASQUATCH", false);
  native.setAudioFlag("LoadMPData", true);
  native.setAudioFlag("DisableFlightMusic", true);
  native.setClockTime(13, 0, 0);
}
