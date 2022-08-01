/// <reference types="@altv/types-client" />
/// <reference types="@altv/types-natives" />
import * as alt from "alt-client";
import { view, PlayerController, View } from "./viewCreator";
import { Camera } from "../views/camera";

alt.on("loadWebviews", async () => {
  alt.onServer("CLIENT:SexChanged", (Sex, ClothesUtils) => {
    view.emit("WEB:SexChanged", Sex, ClothesUtils);
  });
  view.on("CLIENT:ChangeSex", (Sex) => {
    alt.emitServer("SERVER:ChangeSex", Sex);
  });
  view.on("CLIENT:ChangeClothes", (ID, Value) => {
    alt.emitServer("SERVER:ChangeClothes", ID, Value);
  });
  function CloseClothes() {
    View.Remove("Clothes");
    Camera.delete();
    PlayerController(false);
    view.emit("WEB:Clothes", false);
  }
  alt.onServer("CLIENT:Clothes", (Gender, ClothesUtils) => {
    if (View.Info("Clothes")) return CloseClothes(); // If Clothes on top
    View.Add("Clothes");
    PlayerController(true);
    view.emit("WEB:Clothes", true, Gender, ClothesUtils);
    Camera.create();
    return;
  });

  alt.on("CLIENT_CLOTHES:Close", async () => {
    if (View.Info("Chat")) return; // If chat on top
    CloseClothes();
  });
});
