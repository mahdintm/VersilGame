import { sql } from "../database/mysql"
import { ThreeD_Text } from "./3dText"

let businessData = {}

export class Business {
    static Data = {
        set: async (Business_Id, DataName, Value, sql_ = false) => {
            businessData[Business_Id][DataName] = Value
            console.log(Business_Id, DataName, Value)
            if (sql_) {
                await sql(`Update business set ${DataName}='${parseInt(Value)}' where id = "${Business_Id}"`)
            }
            return true
        },
        get: async (Business_Id, DataName) => {
            return businessData[Business_Id] ? businessData[Business_Id][DataName] : false
        }
    }
    static async Load_To_Players(player) {
        Object.entries(businessData).filter(async (v, index, ar) => {
            if (v[1].Owner != -1 && v[1].For_Sell == false) {
                let Owner = await sql(`select pName from Account where pId ="${v[1].Owner}"`)
                await ThreeD_Text.Add(player, 'Business', v[1].id, `Business: ${v[1].id}\n~b~Owner:~w~ ${Owner.pName}\nLevel: ${v[1].Level}}`, JSON.parse(v[1].Pos))
            } else if (v[1].Owner != -1 && v[1].For_Sell == true) {
                let Owner = await sql(`select pName from Account where pId ="${v[1].Owner}"`)
                await ThreeD_Text.Add(player, 'Business', v[1].id, `Business: ${v[1].id}\n~b~Owner:~w~ ${Owner.pName}\nLevel: ${v[1].Level}\nPrice: ${v[1].Price}\nFor buy enter /buy`, JSON.parse(v[1].Pos))
            } else {
                await ThreeD_Text.Add(player, 'Business', v[1].id, `Business: ${v[1].id}\n~b~Owner:~w~ ${v[1].Description}\nLevel: ${v[1].Level}\nPrice: ${v[1].Stand_Price}\nFor buy enter /buy`, JSON.parse(v[1].Pos))
            }
        })
    }
    static Money = {
        Take: async (Business_Id, Ammount) => {
            return await Business.Data.set(Business_Id, 'Money_Box', (parseInt(await Business.Data.get(Business_Id, 'Money_Box')) - parseInt(Ammount)), true)
        },
        get: async (Business_Id) => {
            return await Business.Data.get(Business_Id, 'Money_Box')
        },
        Give: async (Business_Id, Ammount) => {
            return await Business.Data.set(Business_Id, 'Money_Box', (parseInt(await Business.Data.get(Business_Id, 'Money_Box')) + parseInt(Ammount)), true)
        },
        Set: async (Business_Id, Ammount) => {
            return await Business.Data.set(Business_Id, 'Money_Box', parseInt(Ammount), true)
        }
    }
}

setTimeout(async () => {
    let Data_ = await sql('select * from business')
    Data_.forEach(Data => {
        businessData[Data.id] = Data
    });

}, 1000);


