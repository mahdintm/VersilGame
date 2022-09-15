import * as alt from "alt-client";
import * as native from "natives";
import { EventNames } from "../utils/eventNames";

class VGIpl {
  static request(IplName) {
    alt.requestIpl(IplName);
  }
  static remove(IplName) {
    alt.removeIpl(IplName);
  }
}

alt.onServer(EventNames.player.server.RequestIPL, VGIpl.request);
alt.onServer(EventNames.player.server.RemoveIPL, VGIpl.remove);
