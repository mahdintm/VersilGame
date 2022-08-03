/// <reference types="@altv/types-client" />
/// <reference types="@altv/types-natives" />
import * as alt from "alt-client";
import * as native from "natives";
import { view, PlayerController, View } from "./viewCreator";
import { eyeTrackerObjects } from "../utils/eyeTrackerObjects";
import { ChangeValueFromVariable } from "../system/everyTick";

let eyeTrackerFindStatus = false,
  eyeTrackerStatus = false,
  eyeTrackerMenuStatus = false,
  ObjectFoundedDetails = { name: null, titles: null };

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
function SendStatuseyeTrackerToWebView(
  Status,
  ObjectName = null,
  ObjectTitles = null
) {
  if (Status) {
    if (!eyeTrackerFindStatus) {
      view.emit("ClientWEB:eyeTracker:Status", true, "#00ff00");
      eyeTrackerFindStatus = true;
    }
  } else {
    if (eyeTrackerFindStatus) {
      view.emit("ClientWEB:eyeTracker:Status", true);
      eyeTrackerFindStatus = false;
    }
  }
  ObjectFoundedDetails.name = ObjectName;
  ObjectFoundedDetails.titles = ObjectTitles;
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
          SendStatuseyeTrackerToWebView(
            true,
            eyeTrackerObjects[i].name,
            eyeTrackerObjects[i].titles
          );
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
    start.x,
    start.y,
    start.z,
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

export function DisableLeftClickControlAction() {
  native.disableControlAction(0, 24, true); // For Disable Left Click Mouse
}
function RunActionEyeTargetObject(ObjectTitle) {
  console.log(ObjectTitle, "Ejra kon");
  // Ta inja anjam shode
}
function LeftClickMousePressed(Status) {
  if (Status) {
    if (eyeTrackerMenuStatus) return;
    if (!eyeTrackerStatus) return;
    if (!eyeTrackerFindStatus) return;

    if (Object.values(ObjectFoundedDetails.titles).length > 1) {
      PlayerController(true);
      view.emit("ClientWEB:eyeTracker:MenuStatus", true, ObjectFoundedDetails);
      eyeTrackerMenuStatus = true;
    } else {
      RunActionEyeTargetObject(ObjectFoundedDetails.titles[0]);
    }
  } else {
    if (!eyeTrackerMenuStatus) return;

    PlayerController(false);
    eyeTrackerMenuStatus = false;
    if (!eyeTrackerStatus) eyeTrackerManager(false);
    view.emit("ClientWEB:eyeTracker:MenuStatus", false);
  }
}
alt.on("Local:eyeTracker:LeftClickMousePressed", () => {
  LeftClickMousePressed(true);
});
view.on("CLIENT:eyeTracker:ButtonCloseMenuPressed", () => {
  LeftClickMousePressed(false);
});
view.on("CLIENT:eyeTracker:ObjectSelectedFromPlayer", (ObjectTitle) => {
  RunActionEyeTargetObject(ObjectTitle);
});

function eyeTrackerManager(Status) {
  if (Status) {
    view.emit("ClientWEB:eyeTracker:Status", true);
    ChangeValueFromVariable("eyeTragerInterval", true);
    ChangeValueFromVariable("disableLeftClickControlAction", true);
    eyeTrackerStatus = true;
  } else {
    if (!eyeTrackerMenuStatus) {
      view.emit("ClientWEB:eyeTracker:Status", false);
      LeftClickMousePressed(false);
    }
    ChangeValueFromVariable("disableLeftClickControlAction", false);
    ChangeValueFromVariable("eyeTragerInterval", false);
    ChangeValueFromVariable("eyeTragerInternalInterval", undefined);
    eyeTrackerFindStatus = false;
    eyeTrackerStatus = false;
  }
}

alt.on("Local:eyeTracker", eyeTrackerManager);
