/// <reference types="@altv/types-client" />
/// <reference types="@altv/types-natives" />
import * as alt from "alt-client";
import { ChangeValueFromVariable } from "../system/everyTick";

import { EventNames } from "../utils/eventNames";
import { WebViewStatus } from "../utils/WebViewStatus";
import { VGView } from "./webViewController";

export function GetScoreBoardDetails() {
  return alt.emitServer(EventNames.scoreBoard.client.GetScoreBoardDetails);
}
alt.on(EventNames.allVue.localClient.loadWebviews, () => {
  alt.on(EventNames.scoreBoard.localClient.ActiveScoreBoard, async (Status) => {
    if (Status) {
      await VGView.load(WebViewStatus.scoreBoard.name);
      alt.emitServer(EventNames.scoreBoard.client.GetScoreBoardDetails);
      return ChangeValueFromVariable("ScoreBoardStatus", true);
    }
    ChangeValueFromVariable("ScoreBoardStatus", false);
    if (!(await VGView.close(WebViewStatus.scoreBoard.name))) {
      await VGView.emit(
        WebViewStatus.scoreBoard.name,
        WebViewStatus.scoreBoard.EventNames.close
      );
    }
    VGView.once(EventNames.scoreBoard.WEBclient.CloseScoreBoard, async () => {
      await VGView.unload(WebViewStatus.scoreBoard.name);
    });
  });
  alt.onServer(
    EventNames.scoreBoard.server.SetScoreBoardDetails,
    async (ScoreBoardDetails) => {
      await VGView.emit(
        WebViewStatus.scoreBoard.name,
        EventNames.scoreBoard.clientWEB.SetScoreBoardDetails,
        ScoreBoardDetails
      );
    }
  );
});
