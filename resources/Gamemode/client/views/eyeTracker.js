/// <reference types="@altv/types-client" />
/// <reference types="@altv/types-natives" />
import * as alt from "alt-client";
import * as native from "natives";
import { view, PlayerController, View } from "./viewCreator";
import { eyeTrackerObjects } from "../utils/eyeTrackerObjects";
import { ChangeValueFromVariable } from "../system/everyTick";

let eyeTrackerFindStatus = false;

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
function SendStatuseyeTrackerToWebView(Status, ObjectName = null) {
  if (Status) {
    if (!eyeTrackerFindStatus) {
      view.emit("ClientWEB:eyeTracker:Status", true, "#00ff00");
      console.log(ObjectName);
      eyeTrackerFindStatus = true;
    }
  } else {
    if (eyeTrackerFindStatus) {
      view.emit("ClientWEB:eyeTracker:Status", true);
      console.log(ObjectName);
      eyeTrackerFindStatus = false;
    }
  }
}
export function eyeTracker() {
  let [_, _hit, _endCoords, _surfaceNormal, _materialHash, _entityHit] =
    getRaycast();
  if (!_hit) return;
  if (!distance2d(alt.Player.local.pos, _endCoords, 3)) return;

  for (let i = 0; i < eyeTrackerObjects.length; i++) {
    Object.values(eyeTrackerObjects[i].HashIDs).forEach(
      (eyeTrackerObjectHashID) => {
        if (CheckObjectWithHashID(eyeTrackerObjectHashID)) {
          SendStatuseyeTrackerToWebView(true, eyeTrackerObjects[i].name);
          ChangeValueFromVariable("eyeTragerInterval", false);
          ChangeValueFromVariable(
            "eyeTragerInternalInterval",
            eyeTrackerObjectHashID
          );
        }
      }
    );
  }
}

export function InternalEyeTrackerChecker(eyeTrackerObjectHashID) {
  if (!CheckObjectWithHashID(eyeTrackerObjectHashID)) {
    SendStatuseyeTrackerToWebView(false);
    ChangeValueFromVariable("eyeTragerInterval", true);
    ChangeValueFromVariable("eyeTragerInternalInterval", undefined);
  }
}

function CheckObjectWithHashID(eyeTrackerObjectHashID) {
  const [_, _hit, _endCoords, _surfaceNormal, _materialHash, _entityHit] =
    getRaycast();
  if (!distance2d(alt.Player.local.pos, _endCoords, 3)) return false;

  if (native.doesEntityHaveDrawable(_entityHit)) {
    if (native.getEntityModel(_entityHit) == eyeTrackerObjectHashID) {
      return true;
    } else {
      return false;
    }
  }
  if (
    native.getClosestObjectOfType(
      _endCoords.x,
      _endCoords.y,
      _endCoords.z - 1.2,
      0.4,
      eyeTrackerObjectHashID,
      false,
      true,
      true
    )
  ) {
    return true;
  } else {
    return false;
  }
}
export function GetObject() {
  let [_, _hit, _endCoords, _surfaceNormal, _materialHash, _entityHit] =
    getRaycast();
  if (native.doesEntityHaveDrawable(_entityHit)) {
    console.log("Object Hash ID:", native.getEntityModel(_entityHit));
  }
}

function getRaycast() {
  let p = alt.Player;
  let start = native.getFinalRenderedCamCoord();
  let rot = native.getFinalRenderedCamRot(2);
  let fvector = GetDirectionFromRotation(rot);
  let frontOf = new alt.Vector3(
    start.x + fvector.x * 2000,
    start.y + fvector.y * 2000,
    start.z + fvector.z * 2000
  );
  let raycast = native.startExpensiveSynchronousShapeTestLosProbe(
    native.getGameplayCamCoord().x,
    native.getGameplayCamCoord().y,
    native.getGameplayCamCoord().z,
    frontOf.x,
    frontOf.y,
    frontOf.z,
    -1,
    p,
    4
  );
  let getRaycast = native.getShapeTestResultIncludingMaterial(raycast);
  return getRaycast;
}

function GetDirectionFromRotation(rotation) {
  var z = rotation.z * (Math.PI / 180.0);
  var x = rotation.x * (Math.PI / 180.0);
  var num = Math.abs(Math.cos(x));

  return new alt.Vector3(-Math.sin(z) * num, Math.cos(z) * num, Math.sin(x));
}

alt.on("Local:eyeTracker", (Status) => {
  if (Status) {
    view.emit("ClientWEB:eyeTracker:Status", true);
    ChangeValueFromVariable("eyeTragerInterval", true);
  } else {
    view.emit("ClientWEB:eyeTracker:Status", false);
    ChangeValueFromVariable("eyeTragerInterval", false);
    ChangeValueFromVariable("eyeTragerInternalInterval", undefined);
    eyeTrackerFindStatus = false;
  }
});
