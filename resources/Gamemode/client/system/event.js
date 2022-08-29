import * as alt from "alt-client";
import * as native from "natives";
import { LocalStorage } from "./LocalStorage";
import { LoadLoginPage } from "../views/login";
import { EventNames } from "../utils/eventNames";
import { defaultPlayerDetails } from "../utils/defaultPlayerDetails";

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
  if (!(await LocalStorage.getPlayerDetails()))
    await LocalStorage.set("PlayerDetails", defaultPlayerDetails);
  // await LocalStorage.Delete("PlayerDetails");
  let FisrtPlayerCamera;
  function FisrtSetPlayerCamera() {
    native.displayRadar(false);
    FisrtPlayerCamera = native.createCam("DEFAULT_SCRIPTED_CAMERA", true);
    native.setCamCoord(FisrtPlayerCamera, 0, 0, 100);
    native.setCamRot(FisrtPlayerCamera, 0, 0, 0, 2);
    native.setCamFov(FisrtPlayerCamera, 90);
    native.setCamActive(FisrtPlayerCamera, true);
    native.renderScriptCams(true, false, 16, true, false, 0);
  }
  setTimeout(FisrtSetPlayerCamera, 10); // Agar in nabashad camera e'mal nemishavad

  alt.onServer(EventNames.player.server.isFreezeGameControlPlayer, (state) => {
    alt.toggleGameControls(!state);
  });

  alt.on(EventNames.player.localClient.startScriptConnection, async () => {
    alt.emitServer("SyncData_LOCAL", {
      // DiscordID: alt.Discord.currentUser.id,
      Language: (await LocalStorage.getPlayerDetails()).WebLanguage,
    });
    native.destroyCam(FisrtPlayerCamera, false);
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

    native.requestIpl("gabz_pillboxmilo");
    native.requestIpl("gabz_pillbox_2milo");
    native.removeIpl("rc12b_fixed");
    native.removeIpl("rc12b_destroyed");
    native.removeIpl("rc12b_default");
    native.removeIpl("rc12b_hospitalinterior_lod");
    native.removeIpl("rc12b_hospitalinterior");
  });
}
