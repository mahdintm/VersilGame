// function ButtonCloseEyeTrackerMenuPressed() {
//   if ("alt" in window)
//     return alt.emit("CLIENT:eyeTracker:ButtonCloseMenuPressed");
//   return console.log("Clicked");
// }
// function ObjectClickedFromPlayer(ObjectTitle, ObjectAction) {
//   if ("alt" in window)
//     return alt.emit("CLIENT:eyeTracker:ObjectSelectedFromPlayer", {
//       title: ObjectTitle,
//       action: ObjectAction,
//     });
//   return console.log(`Object ${ObjectTitle} click shod`);
// }
// if ("alt" in window) {
//   alt.on("ClientWEB:eyeTracker:Status", (Status, Color = "#ffffff") => {
//     if (Status) {
//       document
//         .getElementById("eyeTrackerBox")
//         .classList.add("eyeTrackerBoxActive");
//       document.getElementById("eyeTrackerBox").style.color = Color;
//       return;
//     } else {
//       document
//         .getElementById("eyeTrackerBox")
//         .classList.remove("eyeTrackerBoxActive");
//     }
//   });
//   alt.on("ClientWEB:eyeTracker:MenuStatus", (Status, Objects = null) => {
//     if (Status) {
//       document
//         .getElementById("eyeTrackerMenuBox")
//         .classList.add("eyeTrackerMenuBoxActive");
//       document.getElementById("eyeTrackerObjectBox").innerHTML = "";

//       Object.values(Objects.titles).forEach((title) => {
//         document.getElementById(
//           "eyeTrackerObjectBox"
//         ).innerHTML += `<div onclick="ObjectClickedFromPlayer('${title.title}', '${title.action}')">${title.title}</div>`;
//       });
//     } else {
//       document
//         .getElementById("eyeTrackerMenuBox")
//         .classList.remove("eyeTrackerMenuBoxActive");
//     }
//   });
// } else {
//   document.getElementById("eyeTrackerBox").classList.add("eyeTrackerBoxActive");
//   document
//     .getElementById("eyeTrackerMenuBox")
//     .classList.add("eyeTrackerMenuBoxActive");
//   setTimeout(() => {
//     setInterval(() => {
//       document
//         .getElementById("eyeTrackerMenuBox")
//         .classList.toggle("eyeTrackerMenuBoxActive");
//     }, 4000);
//   }, 2000);
// }
