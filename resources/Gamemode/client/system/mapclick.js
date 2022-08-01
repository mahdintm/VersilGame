import * as alt from "alt-client";
import * as native from "natives";

alt.onServer("teleportToWaypoint", tpToWaypoint); //sending the function to the server side if requested

function tpToWaypoint() {
  let waypoint = native.getFirstBlipInfoId(8);
  if (native.doesBlipExist(waypoint)) {
    var coords = native.getBlipInfoIdCoord(waypoint);
    var res = native.getGroundZFor3dCoord(
      coords.x,
      coords.y,
      coords.z,
      undefined,
      undefined
    )[0];
    var Gz = coords.z;
    setTimeout(() => {
      res = native.getGroundZFor3dCoord(
        coords.x,
        coords.y,
        Gz + 2,
        undefined,
        undefined
      )[0];
      while (!res) {
        Gz = Gz + 1;
        res = native.getGroundZFor3dCoord(
          coords.x,
          coords.y,
          Gz + 1,
          undefined,
          undefined
        )[0];
        if (Gz > 800) {
          Gz = 0;
          break;
        }
      }
    }, 100);
    if (!res) {
      setTimeout(() => {
        while (!res) {
          Gz = Gz + 1;
          res = native.getGroundZFor3dCoord(
            coords.x,
            coords.y,
            Gz + 1,
            undefined,
            undefined
          )[0];
          if (Gz > 790) {
            break;
          }
        } //this will help out
        native.setPedCoordsKeepVehicle(alt.Player.local, coords.x, coords.y, Gz); //if textures already loaded then nothing to worry about :)
      }, 200);
    }
    native.setPedCoordsKeepVehicle(
      alt.Player.local,
      coords.x,
      coords.y,
      coords.z
    ); //if textures already loaded then nothing to worry about :)
  }
}
