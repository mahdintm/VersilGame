import * as alt from "alt";

alt.on("streamSyncedMetaChange", (entity, key, newValue, oldValue) => {
  switch (key) {
    case "Vehicle:Indicator":
      if (entity.hasStreamSyncedMeta(key)) {
        entity.indicatorLights = newValue;
      }
      break;
    default:
      break;
  }
});
