import { VGPeds } from "./peds";
import { staticPeds } from "../utils/staticPeds";

for (let i = 0; i < Object.keys(staticPeds).length; i++) {
  Object.values(staticPeds)[i].pos.forEach(async (position) => {
    VGPeds.CreateStaticPed({
      ModelHash: Object.values(staticPeds)[i].ModelHash,
      isNetwork: Object.values(staticPeds)[i].isNetwork,
      bScriptHostPed: Object.values(staticPeds)[i].bScriptHostPed,
      isFreezed: Object.values(staticPeds)[i].isFreezed,
      pos: {
        x: position.x,
        y: position.y,
        z: position.z,
        heading: position.heading,
      },
    });
  });
}
