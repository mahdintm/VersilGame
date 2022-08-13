
if ("alt" in window) {
  alt.on(
    "ClientWEB:Vehicle:Information",
    (
      Status,
      RPM = 13, // For value 0 in rotate on 13 deg
      Speed = 0,
      Fuel = 0,
      Engine = false,
      TransitionStatus = true
    ) => {
      if (!Status) {
        document.getElementById("vehicleInfoBox").classList.remove("vehicleInfoBoxActive");
      } else {
        document.getElementById("vehicleInfoBox").classList.add("vehicleInfoBoxActive");
      }
      document.getElementById(
        "VehicleInfoStrela"
      ).style.transform = `translate(-22px, 45px) rotate(${RPM}deg)`;
      document.getElementById("VehicleKMHValue").innerHTML = `${Speed}`;
      document.getElementById("VehicleFuelValue").style.width = `${Fuel}%`;
      Fuel <= 10
        ? document
            .getElementById("VehicleFuelValue")
            .classList.add("VehicleFuelValueAlert")
        : document
            .getElementById("VehicleFuelValue")
            .classList.remove("VehicleFuelValueAlert");
      Engine
        ? (document.getElementById("engine-icon").style.opacity = "1")
        : (document.getElementById("engine-icon").style.opacity = "0.35");

      TransitionStatus
        ? (document.getElementById(
            "VehicleInfoStrela"
          ).style.transition = `0.3s`)
        : (document.getElementById(
            "VehicleInfoStrela"
          ).style.transition = `1s`);
    }
  );
} else {
  // setTimeout(() => {
  //   document.getElementById("vehicleInfoBox").classList.add("vehicleInfoBoxActive");
  //   document.getElementById("VehicleInfoStrela").style.transform =
  //     "translate(-22px, 45px) rotate(280deg)";
  //   document.getElementById("VehicleFuelValue").style.width = "100%";
  //   document
  //     .getElementById("VehicleFuelValue")
  //     .classList.add("VehicleFuelValueAlert");
  // }, 1000);
}
