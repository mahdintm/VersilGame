//client
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

alt.emitServer("Vehicle:IndicatorChange", vehicle, key);

alt.onClient("Vehicle:IndicatorChange", (player, vehicle, key) => {
  vehicle.setStreamSyncedMeta("Vehicle:Indicator", key);
});
