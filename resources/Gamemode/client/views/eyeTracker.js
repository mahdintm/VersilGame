/// <reference types="@altv/types-client" />
/// <reference types="@altv/types-natives" />
import * as alt from "alt-client";
import * as native from "natives";
import { view, PlayerController, View } from "./viewCreator";
import { eyeTrackerObjects } from "../utils/eyeTrackerObjects";
import { ChangeValueFromVariable } from "../system/everyTick";
import { SendObjectTitlesToManageEyeTracker } from "../system/manageEyeTrackerFounded";
import { VGView } from "./webViewController";
import { WebViewStatus } from "../utils/WebViewStatus";
import { EventNames } from "../utils/eventNames";

let eyeTrackerFindStatus = false,
  eyeTrackerStatus = false,
  eyeTrackerMenuStatus = false,
  ObjectFoundedDetails = { name: null, titles: null },
  isClosedEyeTracker = false;

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
      VGView.emit(
        WebViewStatus.eyeTracker.name,
        EventNames.eyeTracker.clientWEB.Status,
        true,
        "#00ff00"
      );
      eyeTrackerFindStatus = true;
    }
  } else {
    if (eyeTrackerFindStatus) {
      VGView.emit(
        WebViewStatus.eyeTracker.name,
        EventNames.eyeTracker.clientWEB.Status,
        true
      );
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
    start.x + fvector.x * 10,
    start.y + fvector.y * 10,
    start.z + fvector.z * 10
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
  if (native.getPedStealthMovement(alt.Player.local)) {
    // if player is Ducking
    // For Disable Left Ctrl
    native.setPedStealthMovement(alt.Player.local, 0, "DEFAULT_ACTION");
  }
}
function RunActionEyeTargetObject(ObjectTitles) {
  LeftClickMousePressed(false, true);
  SendObjectTitlesToManageEyeTracker(ObjectTitles);
}
async function LeftClickMousePressed(Status, isForceClosed = false) {
  if (Status) {
    if (eyeTrackerMenuStatus) return;
    if (!eyeTrackerStatus) return;
    if (!eyeTrackerFindStatus) return;

    if (Object.values(ObjectFoundedDetails.titles).length > 1) {
      // PlayerController(true);
      await VGView.open(WebViewStatus.eyeTracker.name, {
        Status: true,
        ObjectFoundedDetails: ObjectFoundedDetails,
      });

      eyeTrackerMenuStatus = true;
    } else {
      RunActionEyeTargetObject(ObjectFoundedDetails.titles[0]);
    }
  } else {
    if (!eyeTrackerMenuStatus && !isForceClosed) return;

    // PlayerController(false);
    eyeTrackerMenuStatus = false;
    if (!eyeTrackerStatus || isForceClosed) eyeTrackerManager(false);
    await VGView.close(WebViewStatus.eyeTracker.name);
  }
}
alt.on("Local:eyeTracker:LeftClickMousePressed", () => {
  LeftClickMousePressed(true);
});
VGView.on(EventNames.eyeTracker.WEBclient.ButtonCloseMenuPressed, () => {
  LeftClickMousePressed(false);
});
VGView.on(
  EventNames.eyeTracker.WEBclient.ObjectSelectedFromPlayer,
  (ObjectTitle) => {
    RunActionEyeTargetObject(ObjectTitle);
  }
);

async function eyeTrackerManager(Status) {
  if (Status) {
    VGView.load(WebViewStatus.eyeTracker.name);
    await VGView.emit(
      WebViewStatus.eyeTracker.name,
      EventNames.eyeTracker.clientWEB.Status,
      true
    );
    ChangeValueFromVariable("eyeTragerInterval", true);
    ChangeValueFromVariable("disableLeftClickControlAction", true);
    eyeTrackerStatus = true;
    isClosedEyeTracker = false;
  } else if (!isClosedEyeTracker) {
    ChangeValueFromVariable("disableLeftClickControlAction", false);
    ChangeValueFromVariable("eyeTragerInterval", false);
    ChangeValueFromVariable("eyeTragerInternalInterval", undefined);
    eyeTrackerFindStatus = false;
    eyeTrackerStatus = false;
    if (!eyeTrackerMenuStatus && !eyeTrackerStatus) {
      await VGView.emit(
        WebViewStatus.eyeTracker.name,
        EventNames.eyeTracker.clientWEB.Status,
        false
      );
      VGView.close(WebViewStatus.eyeTracker.name);
      await VGView.unload(WebViewStatus.eyeTracker.name);
      LeftClickMousePressed(false);
      isClosedEyeTracker = true;
    }
  }
}

alt.on("Local:eyeTracker", eyeTrackerManager);
