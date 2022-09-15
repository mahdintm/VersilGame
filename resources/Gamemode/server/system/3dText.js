import * as alt from "alt";
import { EventNames } from "../utils/eventNames";

export class ThreeD_Text {
  static async Add(player, Department_, ID, Text_, pos = { x: 255, y: 255, z: 255 }) {
    await alt.emitClient(player, EventNames.player.server.Add3DText, {
      Department: Department_,
      id: ID,
      Text: Text_,
      x: pos.x,
      y: pos.y,
      z: pos.z,
    });
  }
  static async Remove(player, Department_, ID) {
    await alt.emitClient(player, EventNames.player.server.Remove3DText, {
      Department: Department_,
      id: ID,
    });
  }
  static async Modify(player, Department_, ID, Text_, pos = { x: 255, y: 255, z: 255 }) {
    await alt.emitClient(player, EventNames.player.server.Modify3DText, {
      Department: Department_,
      id: ID,
      Text: Text_,
      x: pos.x,
      y: pos.y,
      z: pos.z,
    });
  }
}
