import * as alt from "alt";
import * as native from "natives";
import { EventNames } from "../utils/eventNames";
import { distance2d, drawText3d } from "./functions";

let All3DTextDetails = [];

export class VG3DText {
  static #CheckObject(Object, isRemove = false) {
    if (Object.Department == undefined) return false;
    if (Object.id == undefined) return false;
    if (!isRemove) {
      if (Object.Text == undefined) return false;
      if (Object.x == undefined) return false;
      if (Object.y == undefined) return false;
      if (Object.z == undefined) return false;
    }

    return true;
  }
  static Add(Details) {
    if (!VG3DText.#CheckObject(Details)) return false;

    All3DTextDetails.push(Details);
    return true;
  }
  static Remove(Details) {
    if (!VG3DText.#CheckObject(Details, true)) return false;

    let isRemoved = false;
    All3DTextDetails.forEach((details, index) => {
      if (details.Department != Details.Department) return;
      if (details.id != Details.id) return;
      delete All3DTextDetails[index];
      isRemoved = true;
      return true;
    });
    return isRemoved;
  }
  static Modify(Details) {
    if (!VG3DText.#CheckObject(Details)) return false;

    let isModified = false;
    All3DTextDetails.forEach((details, index) => {
      if (details.Department != Details.Department) return;
      if (details.id != Details.id) return;
      delete All3DTextDetails[index];
      if (VG3DText.Add(Details)) isModified = true;
    });
    return isModified;
  }
  static Load() {
    All3DTextDetails.forEach((Details) => {
      let distanceResult = distance2d(
        { x: Details.x, y: Details.y, z: Details.z },
        alt.Player.local.pos,
        10
      );
      if (alt.Player.local.getSyncedMeta("dimension") == 0) {
      if (distanceResult) {
        drawText3d(
          Details.Text,
          Details.x,
          Details.y,
          Details.z,
          1 - (0.8 * distanceResult) / 10
        );
      }
      }
    });
  }
}

alt.onServer(EventNames.player.server.Add3DText, VG3DText.Add);
alt.onServer(EventNames.player.server.Remove3DText, VG3DText.Remove);
alt.onServer(EventNames.player.server.Modify3DText, VG3DText.Modify);
