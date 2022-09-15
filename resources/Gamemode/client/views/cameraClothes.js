/// <reference types="@altv/types-client" />
/// <reference types="@altv/types-natives" />
import * as alt from "alt-client";
import * as native from "natives";
import { ClothesDetails } from "../utils/ClothesDetails";

let camera,
  CountSetZupValue = 0,
  CountSetZoomValue = 0;
export class VGCameraClothes {
  static create() {
    if (!camera) {
      const cameraPosition = ClothesDetails.ClothesPreviewNPCs.Interior[native.getInteriorFromEntity(alt.Player.local.scriptID)].camera;
      camera = native.createCamWithParams(
        "DEFAULT_SCRIPTED_CAMERA",

        cameraPosition.x,
        cameraPosition.y,
        cameraPosition.z,
        cameraPosition.rx,
        cameraPosition.ry,
        cameraPosition.rz,
        90,
        true,
        0
      );

      native.setCamActive(camera, true);
      native.renderScriptCams(true, false, 0, true, false, 0);
    }
  }
  static async #rotationToDirection(rot) {
    return new alt.Vector3(-Math.sin(rot.z) * Math.abs(Math.cos(rot.x)), Math.cos(rot.z) * Math.abs(Math.cos(rot.x)), Math.sin(rot.x));
  }
  static async #ZoomCamera(Status) {
    const camRot = native.getCamRot(camera, 2);
    const fw = await VGCameraClothes.#rotationToDirection(camRot.mul(Math.PI / 180));
    const camCoord = native.getCamCoord(camera);
    let ZoomAmountDistance = 0;
    if (Status) {
      if (CountSetZoomValue >= 140) return;
      ZoomAmountDistance = 0.01;
      CountSetZoomValue++;
    } else if (!Status) {
      if (CountSetZoomValue <= -100) return;
      ZoomAmountDistance = -0.01;
      CountSetZoomValue--;
    }
    const newCamCoord = camCoord.add(fw.mul(ZoomAmountDistance));
    native.setCamCoord(camera, newCamCoord.x, newCamCoord.y, newCamCoord.z);
  }
  static async #goUpCamera(Status) {
    let zAmountValue = 0;
    if (Status) {
      if (CountSetZupValue >= 100) return;
      zAmountValue = 0.01;
      CountSetZupValue++;
    } else if (!Status) {
      if (CountSetZupValue <= -85) return;
      zAmountValue = -0.01;
      CountSetZupValue--;
    }
    const newCamCoord = native.getCamCoord(camera);
    native.setCamCoord(camera, newCamCoord.x, newCamCoord.y, newCamCoord.z + zAmountValue);
  }
  static async GoUP(Status) {
    VGCameraClothes.#goUpCamera(Status);
  }
  static async ZoomCamera(Status) {
    VGCameraClothes.#ZoomCamera(Status);
  }
  static delete() {
    if (camera) {
      camera = null;
    }
    CountSetZupValue = 0;
    CountSetZoomValue = 0;
    native.destroyAllCams(true);
    native.renderScriptCams(false, false, 0, false, false, 0);
  }
}
