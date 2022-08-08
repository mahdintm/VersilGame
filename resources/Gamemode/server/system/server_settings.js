import { sql } from "../database/mysql";
import { redisDB } from "../database/redis";

let datas = sql(`SELECT * FROM ServerSetting`)
for (let i = 0; i < datas.length; i++) {
    await redisDB.set('ServerSettings', datas[i].name, datas[i].value)
}

export class ServerSetting {
    static async get(key) {
        await redisDB.get('ServerSettings', key)
    }
    static async set(key, value) {
        await redisDB.set('ServerSettings', key, value)
        await sql(`UPDATE ServerSetting SET ${key} = "${value}" WHERE name= "${key}"`)
    }
}