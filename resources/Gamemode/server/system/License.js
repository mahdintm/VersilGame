const licensess = ['driving', 'flying', 'sailing', 'weapon']
import * as alt from 'alt';
import { PlayerData } from './account';
license = {
    'driving': {}
    , 'flying': {}
    , 'sailing': {}
    , 'weapon': {}
}

export class license {
    /**
        * For take a license from player
        * @param {object} player object player altv 
        * @param {string} data license name
        * @returns all licenses after changes
        */
    static async take(player, data) {
        let license = await await JSON.parse(await PlayerData.get(player, "pLicense"))
        license[data].value = 0;
        return await PlayerData.set(player, "pLicense", JSON.stringify(license), true)
    };
    /**
     * For give a license for player
     * @param {object} player object player altv 
     * @param {string} data license name
     * @returns all licenses after changes
     */
    static async give(player, data) {
        let license = await JSON.parse(await PlayerData.get(player, "pLicense"))
        license[data].value = 100;
        return await PlayerData.set(player, "pLicense", JSON.stringify(license), true)
    };
    /**
     * For give all licenses for player
     * @param {object} player object player altv 
     * @returns all licenses after changes
     */
    static async giveall(player) {
        let license = await JSON.parse(await PlayerData.get(player, "pLicense"));
        license["driving"].value = 100;
        license["flying"].value = 100;
        license["sailing"].value = 100;
        license["weapon"].value = 100;
        return await PlayerData.set(player, "pLicense", JSON.stringify(license), true)
    };
    /**
         * For check a license for player
         * @param {object} player object player altv 
         * @returns all licenses
         */
    static async check(player, data) {
        let license = await JSON.parse(await PlayerData.get(player, "pLicense"));
        let lic = license[data]
        if (lic.value <= 0) return false
        if (lic.suspend <= Date.now()) {
            license[data]["suspend"] = 0;
            await PlayerData.set(player, "pLicense", JSON.stringify(license), true)
            return true
        } else
            return false
    }
    static async suspend(player, data, time) {
        let license = await JSON.parse(await PlayerData.get(player, "pLicense"))
        license[data]["suspend"] = (time * 60000) + Date.now();
        return await PlayerData.set(player, "pLicense", JSON.stringify(license), true)
    };

    /**
         * For show all license a player
         * @param {object} player object player altv 
         * @returns all licenses
         */
    static async show(player) {
        return await JSON.parse(await PlayerData.get(player, "pLicense"))
    }

    static async payday() {
        const players = alt.Player.all;
        for (let i = 0; i < players.length; i++) {
            if (players[i].getSyncedMeta('hasLogin')) {
                let license = await JSON.parse(await PlayerData.get(players[i], "pLicense"))
                if (license.driving.value != 0) {
                    license.driving.value -= 1
                }
                if (license.sailing.value != 0) {
                    license.sailing.value -= 1
                }
                if (license.flying.value != 0) {
                    license.flying.value -= 1
                }
                if (license.weapon.value != 0) {
                    license.weapon.value -= 1
                }
                return await PlayerData.set(players[i], "pLicense", JSON.stringify(license), true)
            }
        }
    }

}