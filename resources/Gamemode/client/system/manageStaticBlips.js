import { VGBlips } from "./blips";
import { staticBlipsPos } from "../utils/staticBlipsPos";

for (let i = 0; i < Object.keys(staticBlipsPos).length; i++) {
  Object.values(staticBlipsPos)[i].pos.forEach((pos) => {
    VGBlips.addStaticBlips({
      pos: {
        x: pos.x,
        y: pos.y,
        z: pos.z,
      },
      sprite: Object.values(staticBlipsPos)[i].sprite,
      color: Object.values(staticBlipsPos)[i].color,
      scale: Object.values(staticBlipsPos)[i].scale,
      shortRange: Object.values(staticBlipsPos)[i].shortRange,
      name: Object.values(staticBlipsPos)[i].name,
    });
  });
}
