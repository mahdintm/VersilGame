import { sql } from "../database/mysql";

let ServerSettingData = {};
let datas = await sql(`SELECT * FROM ServerSetting`);
for (let i = 0; i < datas.length; i++) {
  ServerSettingData[datas[i].name] = datas[i].value;
}

export class ServerSetting {
  static async get(key) {
    return await ServerSettingData[key];
  }
  static async set(key, value) {
    ServerSettingData[key] = value;
    await sql(`UPDATE ServerSetting SET ${key} = "${value}" WHERE name= "${key}"`);
  }
}
