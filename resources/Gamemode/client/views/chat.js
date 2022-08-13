/// <reference types="@altv/types-client" />
/// <reference types="@altv/types-natives" />
import * as alt from "alt-client";

import { VGView } from "./webViewController";
import { LocalStorage } from "../system/LocalStorage";
import { EventNames } from "../utils/eventNames";
import { WebViewStatus } from "../utils/WebViewStatus";

alt.on(EventNames.allVue.localClient.loadWebviews, async () => {
  VGView.load(WebViewStatus.chat.name);
  await VGView.emit(
    WebViewStatus.chat.name,
    EventNames.chat.clientWEB.TimeStamp,
    await LocalStorage.get("Chat_TimeStamp")
  );
  alt.emitServer(EventNames.chat.client.Loaded);
  async function closechat() {
    VGView.close(WebViewStatus.chat.name);
  }

  async function addMessage(TimeStamp, name, text) {
    if (name) {
      await VGView.emit(
        WebViewStatus.chat.name,
        EventNames.chat.clientWEB.AddMessage,
        TimeStamp,
        `${name}: ${text}`
      );
    } else {
      await VGView.emit(
        WebViewStatus.chat.name,
        EventNames.chat.clientWEB.AddMessage,
        TimeStamp,
        text
      );
    }
  }

  VGView.on(EventNames.chat.WEBclient.CloseChat, closechat);
  VGView.on(EventNames.chat.WEBclient.AddMessage, (text) => {
    alt.emitServer(EventNames.chat.client.Message, text);
    closechat();
  });
  alt.onServer(EventNames.chat.server.TimeStamp, async () => {
    let data = await LocalStorage.get("Chat_TimeStamp");
    if (data) {
      await VGView.emit(
        WebViewStatus.chat.name,
        EventNames.chat.clientWEB.TimeStamp,
        false
      );
      LocalStorage.set("Chat_TimeStamp", false);
    } else {
      await VGView.emit(EventNames.chat.clientWEB.TimeStamp, true);
      LocalStorage.set("Chat_TimeStamp", true);
    }
  });

  alt.onServer(EventNames.chat.server.Message, addMessage);

  alt.on(EventNames.chat.localClient.KeySlashPressed, async () => {
    await VGView.open(WebViewStatus.chat.name, { isUseSlash: true });
    await VGView.open(WebViewStatus.chat.name);
  });
  alt.on(EventNames.chat.localClient.KeyTPressed, async () => {
    await VGView.open(WebViewStatus.chat.name);
  });
  alt.on(EventNames.chat.localClient.KeyPageUpPressed, async () => {
    await VGView.emit(
      WebViewStatus.chat.name,
      EventNames.chat.clientWEB.Scroll,
      true
    );
  });
  alt.on(EventNames.chat.localClient.KeyPageDownPressed, async () => {
    await VGView.emit(
      WebViewStatus.chat.name,
      EventNames.chat.clientWEB.Scroll,
      false
    );
  });
  alt.on(EventNames.chat.localClient.KeyRowUpPressed, async () => {
    await VGView.isOpenEmit(
      WebViewStatus.chat.name,
      EventNames.chat.clientWEB.KeyRowPressed,
      true
    );
  });
  alt.on(EventNames.chat.localClient.KeyRowDownPressed, async () => {
    await VGView.isOpenEmit(
      WebViewStatus.chat.name,
      EventNames.chat.clientWEB.KeyRowPressed,
      false
    );
  });
});
