/// <reference types="@altv/types-client" />
/// <reference types="@altv/types-natives" />
import * as alt from "alt-client";
import * as native from "natives";

let cameraControlsInterval;
let camera;
let zpos = 0;
let fov = 90;
let startPosition;
let startCamPosition;
let timeBetweenAnimChecks = Date.now() + 100;
export class Camera {
  static create() {
    startPosition = { ...alt.Player.local.pos };
    if (!camera) {
      const forwardVector = native.getEntityForwardVector(
        alt.Player.local.scriptID
      );
      const forwardCameraPosition = {
        x: startPosition.x + forwardVector.x * 1.2,
        y: startPosition.y + forwardVector.y * 1.2,
        z: startPosition.z + zpos,
      };

      fov = 90;
      startCamPosition = forwardCameraPosition;

      camera = native.createCamWithParams(
        "DEFAULT_SCRIPTED_CAMERA",
        forwardCameraPosition.x,
        forwardCameraPosition.y,
        forwardCameraPosition.z,
        0,
        0,
        0,
        fov,
        true,
        0
      );

      native.pointCamAtCoord(
        camera,
        startPosition.x,
        startPosition.y,
        startPosition.z
      );
      native.setCamActive(camera, true);
      native.renderScriptCams(true, false, 0, true, false, 0);
    }

  }
  static delete() {

    if (camera) {
      camera = null;
    }

    native.destroyAllCams(true);
    native.renderScriptCams(false, false, 0, false, false, 0);

    zpos = 0;
    fov = 90;
    startPosition = null;
    startCamPosition = null;
  }
}
