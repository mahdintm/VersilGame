const eyeTrackerBox = document.getElementById("eyeTrackerBox");
if ("alt" in window) {
  alt.on("ClientWEB:eyeTracker:Status", (Status, Color = "#ffffff") => {
    if (Status) {
      eyeTrackerBox.classList.add("eyeTrackerBoxActive");
      eyeTrackerBox.style.color = Color;
      return;
    } else {
      eyeTrackerBox.classList.remove("eyeTrackerBoxActive");
    }
  });
} else {
  eyeTrackerBox.classList.add("eyeTrackerBoxActive");
}
