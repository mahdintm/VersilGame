const eyeTrackerBox = document.getElementById("eyeTrackerBox");
const eyeTrackerObjectBox = document.getElementById("eyeTrackerObjectBox");
const eyeTrackerMenu = document.getElementById("eyeTrackerMenuBox");
function ButtonCloseEyeTrackerMenuPressed() {
  if ("alt" in window)
    return alt.emit("CLIENT:eyeTracker:ButtonCloseMenuPressed");
  return console.log("Clicked");
}
function ObjectClickedFromPlayer(ObjectTitle) {
  if ("alt" in window)
    return alt.emit("CLIENT:eyeTracker:ObjectSelectedFromPlayer", ObjectTitle);
  return console.log(`Object ${ObjectTitle} click shod`);
}
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
  alt.on("ClientWEB:eyeTracker:MenuStatus", (Status, Objects = null) => {
    if (Status) {
      eyeTrackerMenu.classList.add("eyeTrackerMenuBoxActive");
      eyeTrackerObjectBox.innerHTML = "";

      Object.values(Objects.titles).forEach((title) => {
        eyeTrackerObjectBox.innerHTML += `<div onclick="ObjectClickedFromPlayer('${title}')">${title}</div>`;
      });
    } else {
      eyeTrackerMenu.classList.remove("eyeTrackerMenuBoxActive");
    }
  });
} else {
  eyeTrackerBox.classList.add("eyeTrackerBoxActive");
  eyeTrackerMenu.classList.add("eyeTrackerMenuBoxActive");
  setTimeout(() => {
    setInterval(() => {
      eyeTrackerMenu.classList.toggle("eyeTrackerMenuBoxActive");
    }, 4000);
  }, 2000);
}
