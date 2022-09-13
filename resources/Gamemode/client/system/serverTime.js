import * as native from "natives";
import * as alt from "alt";
alt.onServer("Game Time: Sync", (data) => {
  alt.setMsPerGameMinute(data.ms);
  native.setClockTime(data.hour, data.minutes, 0);
});
