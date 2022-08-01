/// <reference types="@altv/types-client" />
/// <reference types="@altv/types-natives" />
import * as alt from "alt-client";
import { view, PlayerController, View } from "./viewCreator";
import { LocalStorage } from "../system/LocalStorage";

alt.on("loadWebviews", async () => {
  view.emit("ShowTimeStampCHAT", await LocalStorage.get("Chat_TimeStamp"));
  alt.emitServer("Chat:Loaded");
  async function closechat() {
    View.Remove("Chat");
    PlayerController(false);
  }

  function addMessage(TimeStamp, name, text) {
    if (name) {
      view.emit("CLIENT:AddMessage", TimeStamp, `${name}: ${text}`);
    } else {
      view.emit("CLIENT:AddMessage", TimeStamp, text);
    }
  }

  view.on("CLIENT:CloseChat", closechat);
  view.on("WEB:AddMessage", (text) => {
    alt.emitServer("chat:message", text);
    closechat();
  });
  alt.onServer("ShowTimeStampCHAT", async () => {
    let data = await LocalStorage.get("Chat_TimeStamp");
    if (data) {
      view.emit("ShowTimeStampCHAT", false);
      LocalStorage.set("Chat_TimeStamp", false);
    } else {
      view.emit("ShowTimeStampCHAT", true);
      LocalStorage.set("Chat_TimeStamp", true);
    }
  });
  alt.onServer("chat:message", addMessage);
});
