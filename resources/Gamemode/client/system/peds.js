import * as alt from "alt";
import * as native from "natives";
import { ClothesDetails } from "../utils/ClothesDetails";

let peds = [],
  unicPeds = [];
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
  static async #CreateUnicPed(PedDetails) {
    await alt.Utils.requestModel(PedDetails.ModelHash);
    const ped = native.createPed(
      2,
      PedDetails.ModelHash,
      PedDetails.pos.x,
      PedDetails.pos.y,
      native.getGroundZFor3dCoord(
        PedDetails.pos.x,
        PedDetails.pos.y,
        PedDetails.pos.z + 1,
        1,
        false,
        false
      )[1],
      PedDetails.pos.heading,
      PedDetails.isNetwork,
      PedDetails.bScriptHostPed
    );
    if (PedDetails.isFreezed) this.#FreezePed(ped);

    unicPeds.push({
      name: PedDetails.name,
      ped: ped,
    });
  }
  static async #RemoveUnicPed(PedName) {
    unicPeds.forEach((unicPed, index, arr) => {
      if (unicPed.name == PedName) {
        native.deletePed(unicPed.ped);
        arr.splice(index, 1);
      }
    });
  }
  static async #SetHeadingOnPed(ped, heading) {
    native.setEntityHeading(ped, heading);
  }
  static CreateStaticPed(PedDetails) {
    this.#CreatePed(PedDetails);
  }
  static CreateUnicPed(PedDetails) {
    this.#CreateUnicPed(PedDetails);
  }
  static DeleteUnicPed(PedName) {
    this.#RemoveUnicPed(PedName);
  }
  static async SetComponentOnPedName(
    pedName,
    componentId,
    drawableId,
    textureId
  ) {
    unicPeds.forEach((unicPed) => {
      if (unicPed.name == pedName) {
        native.setPedComponentVariation(
          unicPed.ped,
          componentId,
          drawableId,
          textureId,
          2
        );
        const pedPos = native.getEntityCoords(
          unicPed.ped,
          !native.isEntityDead(unicPed.ped, false)
        );
        native.getGroundZFor3dCoord(
          pedPos.x,
          pedPos.y,
          pedPos.z + 1,
          1,
          false,
          false
        )[1];
      }
    });
  }
  static async SetComponentOnPed(ped, componentId, drawableId, textureId) {
    native.setPedComponentVariation(ped, componentId, drawableId, textureId, 2);
  }
  static async SetHeadingPedWithKeyUp(pedName, Status) {
    unicPeds.forEach((unicPed) => {
      if (unicPed.name == pedName) {
        if (Status) {
          VGPeds.#SetHeadingOnPed(
            unicPed.ped,
            native.getEntityHeading(unicPed.ped) + 2
          );
        } else {
          VGPeds.#SetHeadingOnPed(
            unicPed.ped,
            native.getEntityHeading(unicPed.ped) + -2
          );
        }
      }
    });
  }
}

alt.on("disconnect", () => {
  peds.forEach((ped) => {
    native.deletePed(ped);
  });
  unicPeds.forEach((unicPed) => {
    native.deletePed(unicPed.ped);
  });
  native.stopAudioScenes();
  native.freezeEntityPosition(alt.Player.local.scriptID, false);
});
