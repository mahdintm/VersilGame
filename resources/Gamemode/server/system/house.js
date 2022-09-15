import { sql } from "../database/mysql";
import { ThreeD_Text } from "./3dText";
import { PlayerData } from "./account";

var houses = {},
  interior = {};

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
  static async GetiplInterior(id) {
    return await interior[id].ipl;
  }
  static async Load_To_Players(player) {
    Object.entries(businessData).filter(async (v, index, ar) => {
      let data = v[1];
      let text = "";
      if (data.Owner != -1 && data.For_Sell == false) {
        let Owner = await PlayerData.Offline.GetPlayerName(data.Owner);
      } else if (data.Owner != -1 && data.For_Sell == true) {
        let Owner = await sql(`select pName from Account where pId ="${data.Owner}"`);
        await ThreeD_Text.Add(player, "House", data.id, `Business: ${data.id}\n~b~Owner:~w~ ${Owner.pName}\nLevel: ${data.Level}\nPrice: ${data.Price}\nFor buy enter /buy`, JSON.parse(data.Pos));
      } else {
        await ThreeD_Text.Add(player, "House", data.id, `Business: ${data.id}\n~b~Owner:~w~ ${data.Description}\nLevel: ${data.Level}\nPrice: ${data.Stand_Price}\nFor buy enter /buy`, JSON.parse(data.Pos));
      }
      await ThreeD_Text.Add(player, "House", data.id, text, JSON.parse(data.Pos));
    });
  }
}

setTimeout(async () => {
  let Data_ = await sql("select * from House");
  Data_.forEach((Data) => {
    houses[Data.id] = Data;
  });
}, 1000);
