import { sql } from "../database/mysql";
import { ThreeD_Text } from "./3dText";
import { PlayerData } from "./account";

let businessData = {};

export class Business {
  static Data = {
    set: async (Business_Id, DataName, Value, sql_ = false) => {
      businessData[Business_Id][DataName] = Value;
      console.log(Business_Id, DataName, Value);
      if (sql_) {
        await sql(`Update Business set ${DataName}='${parseInt(Value)}' where id = "${Business_Id}"`);
      }
      return true;
    },
    get: async (Business_Id, DataName) => {
      return businessData[Business_Id] ? businessData[Business_Id][DataName] : false;
    },
  };
  static async Load_To_Players(player) {
    Object.entries(businessData).filter(async (v, index, ar) => {
      let data = v[1];
      let text = "";
      text += `Business: ${data.id}`;
      data.Owner != -1 ? (text += `\n~b~Owner:~w~ ${await PlayerData.Offline.GetPlayerName(data.Owner)}`) : (text += `\n~b~Owner:~w~ The State`);
      text += `\nLevel: ${data.Level}`;
      data.Owner != -1 && data.For_Sell == true ? (text += `\nPrice: ${data.Price}\nFor buy enter /buy`) : data.Owner != -1 && data.For_Sell == false ? "" : (text += `\nPrice: ${data.Stand_Price}\nFor buy enter /buy`);
      await ThreeD_Text.Add(player, "Business", data.id, text, JSON.parse(data.Pos));
    });
  }
  static Money = {
    Take: async (Business_Id, Ammount) => {
      return await Business.Data.set(Business_Id, "Money_Box", parseInt(await Business.Data.get(Business_Id, "Money_Box")) - parseInt(Ammount), true);
    },
    get: async (Business_Id) => {
      return await Business.Data.get(Business_Id, "Money_Box");
    },
    Give: async (Business_Id, Ammount) => {
      return await Business.Data.set(Business_Id, "Money_Box", parseInt(await Business.Data.get(Business_Id, "Money_Box")) + parseInt(Ammount), true);
    },
    Set: async (Business_Id, Ammount) => {
      return await Business.Data.set(Business_Id, "Money_Box", parseInt(Ammount), true);
    },
  };
}

setTimeout(async () => {
  let Data_ = await sql("select * from Business");
  Data_.forEach((Data) => {
    businessData[Data.id] = Data;
  });
}, 1000);
