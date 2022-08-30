import * as alt from "alt";
import { EventNames } from "../utils/eventNames";
import { Business } from "./business";
import { registerCmd } from "./chat";
import { Money } from "./money";
import { ServerSetting } from "./server_settings";
import { VehicleClass } from "./vehicles";

let GasStatios = [
  {
    Colshape: new alt.ColshapePolygon(27, 35, [
      { x: -63.297, y: -1783.991 },
      { x: -35.367, y: -1753.108 },
      { x: -54.646, y: -1736.914 },
      { x: -96.369, y: -1753.477 },
    ]),
    business_ID: 1,
  },
  {
    Colshape: new alt.ColshapePolygon(18, 25, [
      { x: -705.284, y: -946.642 },
      { x: -705.389, y: -917.684 },
      { x: -735.969, y: -917.684 },
      { x: -744.409, y: -947.921 },
    ]),
    business_ID: 2,
  },
  {
    Colshape: new alt.ColshapePolygon(17, 27, [
      { x: -550.998, y: -1230.831 },
      { x: -530.07, y: -1240.47 },
      { x: -502.629, y: -1214.637 },
      { x: -514.484, y: -1190.993 },
      { x: -522.673, y: -1195.49 },
      { x: -533.09, y: -1192.853 },
    ]),
    business_ID: 3,
  },
  {
    Colshape: new alt.ColshapePolygon(28, 35, [
      { x: 302.281, y: -1232.954 },
      { x: 244.985, y: -1232.743 },
      { x: 250.009, y: -1285.055 },
      { x: 302.519, y: -1284.198 },
    ]),
    business_ID: 4,
  },
  {
    Colshape: new alt.ColshapePolygon(25, 32, [
      { x: 802.009, y: -1018.549 },
      { x: 803.578, y: -1047.363 },
      { x: 813.152, y: -1047.31 },
      { x: 812.651, y: -1040.716 },
      { x: 835.147, y: -1040.097 },
      { x: 835.16, y: -1016.097 },
    ]),
    business_ID: 5,
  },
  {
    Colshape: new alt.ColshapePolygon(33, 39, [
      { x: 1221.257, y: -1383.297 },
      { x: 1194.409, y: -1381.424 },
      { x: 1195.108, y: -1417.029 },
      { x: 1222.352, y: -1410.936 },
    ]),
    business_ID: 6,
  },
  {
    Colshape: new alt.ColshapePolygon(11, 16, [
      { x: -2074.985, y: -341.644 },
      { x: -2073.138, y: -312.554 },
      { x: -2057.815, y: -313.411 },
      { x: -2056.035, y: -297.547 },
      { x: -2139.376, y: -287.103 },
      { x: -2143.16, y: -303.363 },
      { x: -2114.018, y: -309.771 },
      { x: -2114.018, y: -333.811 },
    ]),
    business_ID: 7,
  },
  {
    Colshape: new alt.ColshapePolygon(43, 48, [
      { x: -1400.598, y: -273.073 },
      { x: -1422.488, y: -236.308 },
      { x: -1459.187, y: -270.673 },
      { x: -1431.534, y: -301.754 },
    ]),
    business_ID: 8,
  },
  {
    Colshape: new alt.ColshapePolygon(101, 110, [
      { x: 585.851, y: 260.993 },
      { x: 648.251, y: 233.855 },
      { x: 671.116, y: 272.637 },
      { x: 630.33, y: 313.055 },
    ]),
    business_ID: 9,
  },
  {
    Colshape: new alt.ColshapePolygon(66, 73, [
      { x: 1191.495, y: -311.077 },
      { x: 1168.022, y: -314.927 },
      { x: 1170.277, y: -326.308 },
      { x: 1148.136, y: -330.316 },
      { x: 1152.04, y: -346.695 },
      { x: 1196.967, y: -355.807 },
    ]),
    business_ID: 10,
  },
  {
    Colshape: new alt.ColshapePolygon(134, 144, [
      { x: -1830.396, y: 779.301 },
      { x: -1817.67, y: 767.248 },
      { x: -1764.04, y: 811.622 },
      { x: -1799.051, y: 825.943 },
      { x: -1825.411, y: 807.969 },
      { x: -1814.189, y: 794.334 },
    ]),
    business_ID: 11,
  },
  {
    Colshape: new alt.ColshapePolygon(106, 110, [
      { x: 2596.457, y: 331.767 },
      { x: 2600.242, y: 398.202 },
      { x: 2562.765, y: 401.763 },
      { x: 2560.18, y: 331.991 },
    ]),
    business_ID: 12,
  },
  {
    Colshape: new alt.ColshapePolygon(32, 35, [
      { x: -2526.356, y: 2351.763 },
      { x: -2569.147, y: 2348.097 },
      { x: -2576.927, y: 2317.266 },
      { x: -2512.048, y: 2317.292 },
    ]),
    business_ID: 13,
  },
  {
    Colshape: new alt.ColshapePolygon(55, 60, [
      { x: 23.064, y: 2782.497 },
      { x: 66.949, y: 2748.936 },
      { x: 69.837, y: 2778.844 },
      { x: 46.022, y: 2809.938 },
    ]),
    business_ID: 14,
  },
  {
    Colshape: new alt.ColshapePolygon(43, 48, [
      { x: 297.323, y: 2587.635 },
      { x: 280.642, y: 2628.185 },
      { x: 243.02, y: 2619.363 },
      { x: 248.901, y: 2592.528 },
    ]),
    business_ID: 15,
  },
  {
    Colshape: new alt.ColshapePolygon(36, 41, [
      { x: 1194.132, y: 2674.813 },
      { x: 1185.969, y: 2655.561 },
      { x: 1207.121, y: 2633.829 },
      { x: 1224.672, y: 2674.681 },
    ]),
    business_ID: 16,
  },
  {
    Colshape: new alt.ColshapePolygon(36, 41, [
      { x: 2562.026, y: 2643.086 },
      { x: 2521.147, y: 2639.631 },
      { x: 2524.589, y: 2575.437 },
      { x: 2578.8, y: 2581.741 },
    ]),
    business_ID: 17,
  },
  {
    Colshape: new alt.ColshapePolygon(54, 58, [
      { x: 2686.272, y: 3289.424 },
      { x: 2665.859, y: 3252.501 },
      { x: 2680.563, y: 3244.299 },
      { x: 2702.466, y: 3284.572 },
    ]),
    business_ID: 18,
  },
  {
    Colshape: new alt.ColshapePolygon(31, 35, [
      { x: 1989.363, y: 3774.739 },
      { x: 2001.93, y: 3754.272 },
      { x: 2027.736, y: 3769.029 },
      { x: 2017.042, y: 3789.336 },
    ]),
    business_ID: 19,
  },
  {
    Colshape: new alt.ColshapePolygon(41, 46, [
      { x: 1710.0, y: 4945.583 },
      { x: 1695.389, y: 4959.495 },
      { x: 1673.683, y: 4921.147 },
      { x: 1685.631, y: 4915.016 },
    ]),
    business_ID: 20,
  },
  {
    Colshape: new alt.ColshapePolygon(30, 37, [
      { x: 1712.031, y: 6399.864 },
      { x: 1719.547, y: 6419.328 },
      { x: 1694.466, y: 6431.42 },
      { x: 1681.701, y: 6412.009 },
    ]),
    business_ID: 21,
  },
  {
    Colshape: new alt.ColshapePolygon(29, 37, [
      { x: 168.725, y: 6562.853 },
      { x: 205.727, y: 6578.281 },
      { x: 204.382, y: 6629.895 },
      { x: 142.655, y: 6649.147 },
      { x: 103.543, y: 6607.253 },
    ]),
    business_ID: 22,
  },
  {
    Colshape: new alt.ColshapePolygon(29, 37, [
      { x: -114.633, y: 6409.728 },
      { x: -102.949, y: 6400.563 },
      { x: -79.952, y: 6421.319 },
      { x: -88.681, y: 6432.145 },
    ]),
    business_ID: 23,
  },
];

export class GasStation {
  static async #CheckStation(player) {
    for await (const Station of GasStatios) {
      if (await Station.Colshape.isEntityIn(player)) {
        return Station;
      }
    }
  }
  static async Fill(player) {
    if (!player.vehicle) return console.log("mashin nadari");
    let Station = await this.#CheckStation(player);
    if (!Station) return console.log("tush nisti");
    let MaxFule = await VehicleClass.data.get(player.vehicle, "maxfuel");
    let NowFule = await VehicleClass.fuel.get(player.vehicle);
    let Price = (MaxFule - NowFule) * (await ServerSetting.get("Fuel_Price"));
    if (MaxFule == NowFule) return console.log("pore");
    if ((await Money.get(player)) < Price) return console.log("pul nadarii");
    alt.emitClient(
      player,
      EventNames.player.server.isFreezeGameControlPlayer,
      true
    );
    await VehicleClass.engine.on(player.vehicle, false);
    await Money.take(player, Price);
    await Business.Money.Give(Station.business_ID, Price);
    let inter = setInterval(async () => {
      await VehicleClass.fuel.give(
        player.vehicle,
        Math.random(Math.random() * (10 - 1) + 1)
      );
      if (MaxFule <= (await VehicleClass.fuel.get(player.vehicle))) {
        alt.emitClient(
          player,
          EventNames.player.server.isFreezeGameControlPlayer,
          false
        );
        await VehicleClass.engine.on(player.vehicle, true);
        clearInterval(inter);
      }
    }, 80);
  }
}

registerCmd("bb", async (player) => {
  await GasStation.Fill(player);
});
