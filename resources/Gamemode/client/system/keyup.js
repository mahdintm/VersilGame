import * as alt from "alt";

alt.on("keyup", (key) => {
  switch (key) {
    //ServerOption
    case 0x32:
      //2
      alt.emit("Local:Vehicle:Engine");
      break;
    case 0x01:
      // Left Click Mouse pressed
      alt.emit("Local:eyeTracker:LeftClickMousePressed");
      break;
    //WebView
    case 0x54:
    case 0xc0:
      //T, ~ pressed
      alt.emit("CLIENT_CHAT:KeyTPressed");
      break;
    case 0xbf:
      // Slash (/) pressed
      alt.emit("CLIENT_CHAT:KeySlashPressed");
      break;
    case 0x21:
      // Page UP pressed
      alt.emit("CLIENT_CHAT:KeyPageUpPressed");
      break;
    case 0x22:
      // Page Down pressed
      alt.emit("CLIENT_CHAT:KeyPageDownPressed");
      break;
    case 0x1b:
      // ESC key pressed
      alt.emit("CLIENT_CLOTHES:KeyESCPressed");
      break;
    case 0x12:
      // ALT pressed
      alt.emit("Local:eyeTracker", false);
      break;
  }
});
