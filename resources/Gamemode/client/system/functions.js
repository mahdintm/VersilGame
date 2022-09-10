import * as alt from "alt";
import * as native from "natives";
import { EventNames } from "../utils/eventNames";

let DebugMode = false;

/**
 *
 * @param {object} vector1 object x y z of location
 * @param {object} vector2  object position player
 * @param {number} distance distance
 * @returns {boolean} true / false
 */
export function distance2d(vector1, vector2, distance) {
  let dist = Math.sqrt(
    Math.pow(vector1.x - vector2.x, 2) + Math.pow(vector1.y - vector2.y, 2)
  );
  if (dist < distance) {
    return dist;
  } else {
    return false;
  }
}
export function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}
export function drawText3d(
  msg,
  x,
  y,
  z,
  scale,
  fontType = 4,
  r = 255,
  g = 255,
  b = 255,
  a = 255,
  useOutline = true,
  useDropShadow = true
) {
  let hex = msg.match("{.*}");
  if (hex) {
    const rgb = hexToRgb(hex[0].replace("{", "").replace("}", ""));
    r = rgb.r;
    g = rgb.g;
    b = rgb.b;
    msg = msg.replace(hex[0], "");
  }
  native.setDrawOrigin(x, y, z, 0);
  native.beginTextCommandDisplayText("STRING");
  native.addTextComponentSubstringPlayerName(msg);
  native.setTextFont(fontType);
  native.setTextScale(1, scale);
  native.setTextWrap(0.0, 1.0);
  native.setTextCentre(true);
  native.setTextColour(r, g, b, a);
  if (useOutline) {
    native.setTextOutline();
  }

  if (useDropShadow) {
    native.setTextDropShadow();
  }
  native.endTextCommandDisplayText(0, 0, 0);
  native.clearDrawOrigin();
}

export class VG {
  static debugLog(...args) {
    if (DebugMode) console.log(...args);
  }
  static log(...args) {
    console.log(...args);
  }
  static serverLog(...args) {
    alt.emitServer(EventNames.player.client.ServerLog, ...args);
  }
}
