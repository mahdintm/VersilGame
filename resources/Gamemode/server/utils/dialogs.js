import fs from "fs";
export class Language {
  static async GetValue(LanguageType, Key, args = []) {
    let text = await JSON.parse(await fs.promises.readFile(`./resources/Gamemode/server/utils/locale/${LanguageType}.json`, "utf8"))[Key];
    let i = 0;
    for await (const args_ of args) {
      text = await text.replace(`{${i}}`, args_);
      i++;
    }
    return text;
  }
}
