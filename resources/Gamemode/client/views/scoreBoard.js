/// <reference types="@altv/types-client" />
/// <reference types="@altv/types-natives" />
import * as alt from "alt-client";
import * as native from "natives";

import { ChangeValueFromVariable } from "../system/everyTick";
import { EventNames } from "../utils/eventNames";
import { WebViewStatus } from "../utils/WebViewStatus";
import { VGView } from "./webViewController";

export class VGScoreBoard {
  static GetScoreBoardDetails() {
    return alt.emitServer(EventNames.scoreBoard.client.GetScoreBoardDetails);
  }
  static DisableLeftClickControlAction() {
    native.disableControlAction(0, 24, true); // For Disable Left Click Mouse
  }
  static LeftClickMousePressed() {
    VGView.open(WebViewStatus.scoreBoard.name);
  }
  static async ActiveScoreBoard(Status) {
    if (Status) {
      await VGView.load(WebViewStatus.scoreBoard.name);
      alt.emitServer(EventNames.scoreBoard.client.GetScoreBoardDetails);
      ChangeValueFromVariable("ScoreBoardStatus", true);
      return ChangeValueFromVariable(
        "disableLeftClickControlFromScoreBoard",
        true
      );
    }
    ChangeValueFromVariable("ScoreBoardStatus", false);
    ChangeValueFromVariable("disableLeftClickControlFromScoreBoard", false);
    if (!(await VGView.close(WebViewStatus.scoreBoard.name))) {
      await VGView.emit(
        WebViewStatus.scoreBoard.name,
        WebViewStatus.scoreBoard.EventNames.close
      );
    }
    VGView.once(EventNames.scoreBoard.WEBclient.CloseScoreBoard, async () => {
      ChangeValueFromVariable("ScoreBoardStatus", false);
      ChangeValueFromVariable("disableLeftClickControlFromScoreBoard", false);
      await VGView.unload(WebViewStatus.scoreBoard.name);
    });
  }
}
alt.on(EventNames.allVue.localClient.loadWebviews, () => {
  alt.on(
    EventNames.scoreBoard.localClient.ActiveScoreBoard,
    VGScoreBoard.ActiveScoreBoard
  );
  alt.on(
    EventNames.scoreBoard.localClient.LeftClickMousePressed,
    VGScoreBoard.LeftClickMousePressed
  );
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
