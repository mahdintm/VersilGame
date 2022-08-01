import fs from 'fs'
export class Language {
    static async GetValue(LanguageType, Key) {
        // try {
        // console.log(LanguageType)
        // return fs.readFile(`./resources/Gamemode/server/utils/locale/${LanguageType}.json`, 'utf8', (err, data) => {
        //     if (err) {
        //         console.error(err);
        //         return;
        //     }
        //     return JSON.parse(data)[Key];
        // });

        return await JSON.parse(await fs.promises.readFile(`./resources/Gamemode/server/utils/locale/${LanguageType}.json`, 'utf8'))[Key]
    }
}