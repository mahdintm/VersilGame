import * as alt from "alt";
import * as native from "natives";
let peds = [];
export class VGPeds {
  static #FreezePed(ped) {
    native.setEntityAsMissionEntity(ped, true, false); // make sure its not despawned by game engine
    native.setBlockingOfNonTemporaryEvents(ped, true); // make sure ped doesnt flee etc only do what its told
    native.setPedCanBeTargetted(ped, false);
    native.setPedCanBeKnockedOffVehicle(ped, 1);
    native.setPedCanBeDraggedOut(ped, false);
    native.setPedSuffersCriticalHits(ped, false);
    native.setPedDropsWeaponsWhenDead(ped, false);
    native.setPedDiesInstantlyInWater(ped, false);
    native.setPedCanRagdoll(ped, false);
    native.setPedDiesWhenInjured(ped, false);
    native.taskSetBlockingOfNonTemporaryEvents(ped, true);
    native.setPedFleeAttributes(ped, 0, false);
    native.setPedConfigFlag(ped, 32, false); // ped cannot fly thru windscreen
    native.setPedConfigFlag(ped, 281, true); // ped no writhe
    native.setPedGetOutUpsideDownVehicle(ped, false);
    native.setPedCanEvasiveDive(ped, false);
    native.freezeEntityPosition(ped, true);
    native.setEntityInvincible(ped, true);
  }
  static async #CreatePed(PedDetails) {
    await alt.Utils.requestModel(PedDetails.ModelHash);
    const ped = native.createPed(
      2,
      PedDetails.ModelHash,
      PedDetails.pos.x,
      PedDetails.pos.y,
      PedDetails.pos.z,
      PedDetails.pos.heading,
      PedDetails.isNetwork,
      PedDetails.bScriptHostPed
    );
    if (PedDetails.isFreezed) this.#FreezePed(ped);

    peds.push(ped);
  }
  static CreateStaticPed(PedDetails) {
    this.#CreatePed(PedDetails);
  }
}

alt.on("disconnect", () => {
  peds.forEach((ped) => {
    native.deletePed(ped);
  });
  native.stopAudioScenes();
  native.freezeEntityPosition(alt.Player.local.scriptID, false);
});
