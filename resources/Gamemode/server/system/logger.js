import fs from "fs";
import { PlayerData } from "./account";

let folders = ["chat", "commands", "money"];

export class logger {
  static get_year_month(date) {
    return date.getFullYear() + "_" + date.toLocaleString("default", { month: "long" });
  }
  static async createfolders(year_month) {
    if (!fs.existsSync("./logger")) {
      await fs.promises.mkdir("./logger");
    }
    if (!fs.existsSync(`./logger/${year_month}`)) {
      await fs.promises.mkdir(`./logger/${year_month}`);
    }
    for (let i = 0; i < folders.length; i++) {
      if (!fs.existsSync(`./logger/${year_month}/${folders[i]}`)) {
        await fs.promises.mkdir(`./logger/${year_month}/${folders[i]}`);
      }
      if (!fs.existsSync(`./logger/${year_month}/${folders[i]}/RolePlay`)) {
        await fs.promises.mkdir(`./logger/${year_month}/${folders[i]}/RolePlay`);
      }
      if (!fs.existsSync(`./logger/${year_month}/${folders[i]}/RolePlayGame`)) {
        await fs.promises.mkdir(`./logger/${year_month}/${folders[i]}/RolePlayGame`);
      }
    }
  }
  static addlog = {
    /**
     * for logging any chat
     * @param {string} FromServer in rp || rpg
     * @param {string} ChatLocation any service Exmaple:chat||adminchat
     * @param {object} player altv player object
     * @param {object} LogDetail detail object Exmaple:{msg:"test"}
     * @returns none
     */
    async chat(FromServer, ChatLocation, player, LogDetail) {
      let date = new Date();
      LogDetail["date"] = date.toLocaleDateString("fa-IR");
      LogDetail["time"] = `${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
      LogDetail["player"] = {
        id: PlayerData.get(player.getSyncedMeta("inServer"), player, "pId"),
        name: PlayerData.get(player.getSyncedMeta("inServer"), player, "pName"),
      };
      let year_month = logger.get_year_month(date);
      await logger.createfolders(year_month);
      if (!fs.existsSync(`./logger/${year_month}/chat/${FromServer}/${ChatLocation}.json`)) await fs.promises.writeFile(`./logger/${year_month}/chat/${FromServer}/${ChatLocation}.json`, "{}", "utf-8");
      let log = JSON.parse(await fs.promises.readFile(`./logger/${year_month}/chat/${FromServer}/${ChatLocation}.json`, "utf-8"));
      if (log[sqlid] == undefined) log[sqlid] = [];
      log[sqlid].push(LogDetail);
      log = JSON.stringify(log);
      await fs.promises.writeFile(`./logger/${year_month}/chat/${FromServer}/${ChatLocation}.json`, log, "utf-8");
    },
    async server(msg) {
      console.log(msg);
      let date = new Date();
      let year_month = logger.get_year_month(date);
      await logger.createfolders(year_month);
      if (!fs.existsSync(`./logger/server_err.json`)) await fs.promises.writeFile(`./logger/server_err.json`, "{}", "utf-8");
      let log = JSON.parse(await fs.promises.readFile(`./logger/server_err.json`, "utf-8"));
      log[date] = msg;
      log = JSON.stringify(log);
      await fs.promises.writeFile(`./logger/server_err.json`, log, "utf-8");
    },
  };
}
