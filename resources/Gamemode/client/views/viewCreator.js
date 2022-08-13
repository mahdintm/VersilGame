import * as alt from "alt-client";

let viewStatus = [];
export const view = new alt.WebView(
  "http://assets/Webview/client/allViews/test.html"
);
export class View {
  static Add(name) {
    viewStatus.push(name);
  }
  static Remove(name) {
    if (viewStatus.indexOf(name) != -1)
      viewStatus.splice(viewStatus.indexOf(name), 1);
  }
  static Info(name) {
    if (viewStatus.indexOf(name) != -1) return true;
    return false;
  }
}

let ControllerStatus = false;
export function PlayerController(status = true) {
  if (status && !ControllerStatus) {
    // alt.toggleGameControls(false);

    // alt.setCursorPos(new alt.Vector2(0.5, 0.5), true);
    // alt.showCursor(true);
    // view.focus();
    ControllerStatus = true;
  } else if (!status && ControllerStatus) {
    if (viewStatus.indexOf("Clothes") != -1) return; // if Clothes on top

    // view.unfocus();
    // alt.showCursor(false);
    // alt.toggleGameControls(true);
    ControllerStatus = false;
  }
}
