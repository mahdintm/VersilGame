import { sql } from "../database/mysql";
import alt from "alt";
import { ThreeD_Text } from "./3dText";
import { PlayerData } from "./account";
import { registerCmd } from "./chat";
import { ipl_location } from "../utils/ipllocations";

var houses = {},
  interior = {},
  int = 1;

export class House {
  static Data = {
    Get: async (HouseID, DataName) => {
      return await houses[HouseID][DataName];
    },
    Set: async (HouseID, DataName, value) => {
      houses[HouseID][DataName] = value;
      await sql(`update House Set ${DataName}="${value}" where Id="${HouseID}"`);
      return true;
    },
  };
  static ThreedText = {
    Create: async (player, data) => {
      let text = "";
      text += `House: ${data.Id}`;
      data.Owner != -1 ? (text += `\n~b~Owner:~w~ ${await PlayerData.Offline.GetPlayerName(data.Owner)}`) : (text += `\n~b~Owner:~w~ The State`);
      text += `\nLevel: ${data.Level}`;
      data.Owner != -1 && data.For_Sell == true ? (text += `\nPrice: ${data.Price}\nFor buy enter /buy`) : data.Owner != -1 && data.For_Sell == false ? "" : (text += `\nPrice: ${data.Stand_Price}\nFor buy enter /buy`);
      console.log(text);
      await ThreeD_Text.Add(player, "House", data.Id, text, data.Out_Pos);
    },
    Edit: async () => {},
  };
  static async GetiplInterior(id) {
    return await interior[id].ipl;
  }
  static async Create(player, interior_) {
    let db = await sql(`insert into House (Out_Pos,Interior_ID) values ('${JSON.stringify(player.pos)}','${interior_}')`);
    houses[db.insertId] = {
      Id: db.insertId,
      Out_Pos: player.pos,
      In_Pos: { x: ipl_location[interior_].x, y: ipl_location[interior_].y, z: ipl_location[interior_].z },
      Interior_ID: interior_,
      Stand_Price: 100000,
      Price: 0,
      IsOpen: 1,
      Owner: -1,
      For_Sell: 0,
      Description: "The State",
      Rent_Slot: 1,
      Renters: [],
      Inventori: {},
      Level: 1,
    };
    for await (const player of await alt.Player.all) {
      if ((await allPlayers[i].getSyncedMeta("hasLogin")) == false) continue;
      await House.ThreedText.Create(player, houses[db.insertId]);
    }
  }
  static async Load_To_Players(player) {
    Object.entries(houses).filter(async (v, index, ar) => {
      console.log(v[1]);
      House.ThreedText.Create(player, v[1]);
    });
  }
}
registerCmd("test1", (player, args) => {
  House.Create(player, args[0]);
});

setTimeout(async () => {
  for (let i = 18; i <= 40; i++) {
    if (ipl_location[i] != undefined) {
      interior[int] = ipl_location[i];
      int++;
    }
    if (i == 40) {
      let Data_ = await sql("select * from House");
      for await (const Data of Data_) {
        houses[Data.Id] = Data;
        houses[Data.Id].Out_Pos = JSON.parse(houses[Data.Id].Out_Pos);
        houses[Data.Id].In_Pos = { x: ipl_location[Data.Interior_ID].x, y: ipl_location[Data.Interior_ID].y, z: ipl_location[Data.Interior_ID].z };
        houses[Data.Id].Renters = JSON.parse(houses[Data.Id].Renters);
        houses[Data.Id].Inventori = JSON.parse(houses[Data.Id].Inventori);
      }
    }
  }
}, 1000);
