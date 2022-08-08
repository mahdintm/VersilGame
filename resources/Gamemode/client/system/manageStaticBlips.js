import { VGBlips } from "./blips";
import { staticBlips } from "../utils/staticBlips";

for (let i = 0; i < Object.keys(staticBlips).length; i++) {
  Object.values(staticBlips)[i].pos.forEach((pos) => {
    VGBlips.addStaticBlips({
      pos: {
        x: pos.x,
        y: pos.y,
        z: pos.z,
      },
      sprite: Object.values(staticBlips)[i].sprite,
      color: Object.values(staticBlips)[i].color,
      scale: Object.values(staticBlips)[i].scale,
      shortRange: Object.values(staticBlips)[i].shortRange,
      name: Object.values(staticBlips)[i].name,
    });
  });
}
