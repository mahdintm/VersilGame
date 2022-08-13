/// <reference types="@altv/types-client" />
/// <reference types="@altv/types-natives" />
import * as alt from "alt-client";
import { Camera } from "../views/camera";
import { VGView } from "./webViewController";
import { EventNames } from "../utils/eventNames";
import { WebViewStatus } from "../utils/WebViewStatus";

alt.on(EventNames.allVue.localClient.loadWebviews, async () => {
  alt.onServer("CLIENT:SexChanged", (Sex, ClothesUtils) => {
    VGView.emit(
      WebViewStatus.clothes.name,
      EventNames.clothes.clientWEB.SexChanged,
      Sex,
      ClothesUtils
    );
  });
  VGView.on(EventNames.clothes.WEBclient.ChangeSex, (Sex) => {
    alt.emitServer("SERVER:ChangeSex", Sex);
  });
  VGView.on(EventNames.clothes.WEBclient.ChangeClothes, (ID, Value) => {
    alt.emitServer("SERVER:ChangeClothes", ID, Value);
  });
  VGView.once(EventNames.clothes.WEBclient.CloseClothes, async () => {
    VGView.close(WebViewStatus.clothes.name);
    Camera.delete();
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
    Camera.create();
    return;
  });
});
