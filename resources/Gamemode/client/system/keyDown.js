import * as alt from "alt";

alt.on("keydown", (key) => {
  switch (key) {
    case 0x12:
      // ALT pressed
      alt.emit("Local:eyeTracker", true);
      break;
  }
});
