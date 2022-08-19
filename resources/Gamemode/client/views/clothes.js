/// <reference types="@altv/types-client" />
/// <reference types="@altv/types-natives" />
import * as alt from "alt-client";
import * as native from "natives";

import { VGCameraClothes } from "./cameraClothes";
import { VGView } from "./webViewController";
import { EventNames } from "../utils/eventNames";
import { WebViewStatus } from "../utils/WebViewStatus";
import { VGPeds } from "../system/peds";
import { ClothesDetails } from "../utils/ClothesDetails";
function CreateClothesPed(Gender) {
  if (Gender == "male") {
    VGPeds.CreateUnicPed({
      name: ClothesDetails.ClothesPreviewNPCs.name,
      ModelHash: ClothesDetails.ClothesPreviewNPCs.MaleModelHash,
      isNetwork: ClothesDetails.ClothesPreviewNPCs.isNetwork,
      bScriptHostPed: ClothesDetails.ClothesPreviewNPCs.bScriptHostPed,
      isFreezed: ClothesDetails.ClothesPreviewNPCs.isFreezed,
      pos: ClothesDetails.ClothesPreviewNPCs.Interior[
        native.getInteriorFromEntity(alt.Player.local.scriptID)
      ].pos,
    });
  } else {
    VGPeds.CreateUnicPed({
      name: ClothesDetails.ClothesPreviewNPCs.name,
      ModelHash: ClothesDetails.ClothesPreviewNPCs.FemaleModelHash,
      isNetwork: ClothesDetails.ClothesPreviewNPCs.isNetwork,
      bScriptHostPed: ClothesDetails.ClothesPreviewNPCs.bScriptHostPed,
      isFreezed: ClothesDetails.ClothesPreviewNPCs.isFreezed,
      pos: ClothesDetails.ClothesPreviewNPCs.Interior[
        native.getInteriorFromEntity(alt.Player.local.scriptID)
      ].pos,
    });
  }
}
alt.on(EventNames.allVue.localClient.loadWebviews, async () => {
  VGView.on(EventNames.clothes.WEBclient.ChangeSex, (Sex) => {
    alt.emitServer("SERVER:ChangeSex", Sex);
  });
  VGView.on(
    EventNames.clothes.WEBclient.ChangeClothes,
    (componentId, drawableId) => {
      VGPeds.SetComponentOnPedName(
        ClothesDetails.ClothesPreviewNPCs.name,
        componentId + 1,
        drawableId - 1,
        0
      ); // -1 for started as number 1
    }
  );
  VGView.on(EventNames.clothes.WEBclient.OrderList, () => {
    console.log("test test");
  });
  VGView.on(EventNames.clothes.WEBclient.Suggestion, (Gender, SuggestionID) => {
    try {
      ClothesDetails.Suggestions[SuggestionID][Gender.toLowerCase()].forEach(
        (SuggestionDetails) => {
          VGPeds.SetComponentOnPedName(
            ClothesDetails.ClothesPreviewNPCs.name,
            SuggestionDetails.componentID,
            SuggestionDetails.drawableID,
            SuggestionDetails.textureID
          );
        }
      );
    } catch (error) {}
  });
  VGView.once(EventNames.clothes.WEBclient.CloseClothes, async () => {
    VGView.close(WebViewStatus.clothes.name);
    VGCameraClothes.delete();
    VGPeds.DeleteUnicPed(ClothesDetails.ClothesPreviewNPCs.name);
    setTimeout(async () => {
      await VGView.unload(WebViewStatus.clothes.name);
    }, 200);
  });
  alt.onServer("CLIENT:Clothes", async (Gender, ClothesUtils) => {
    await VGView.load(WebViewStatus.clothes.name);
    VGView.open(WebViewStatus.clothes.name);
    VGView.emit(
      WebViewStatus.clothes.name,
      EventNames.clothes.clientWEB.OpenClothes,
      Gender,
      ClothesUtils
    );
    VGCameraClothes.create();
    CreateClothesPed(Gender);

    return;
  });
  alt.onServer("CLIENT:SexChanged", (Gender, ClothesUtils) => {
    VGPeds.DeleteUnicPed(ClothesDetails.ClothesPreviewNPCs.name);
    CreateClothesPed(Gender);

    VGView.emit(
      WebViewStatus.clothes.name,
      EventNames.clothes.clientWEB.SexChanged,
      Gender,
      ClothesUtils
    );
  });
});
