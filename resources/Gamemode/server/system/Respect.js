
import * as alt from 'alt';
import { PlayerData } from './account';

export class Respect {
    static async payday() {
        const players = alt.Player.all;
        for (let i = 0; i < players.length; i++) {
            if (players[i].getSyncedMeta('hasLogin'))
                await PlayerData.set(players[i], 'pRespect', parseInt(await PlayerData.get(players[i], 'pRespect')) + 1, true)
        }
    };

    static async Get(player) {
        return parseInt(await PlayerData.get(player, "pRespect"))
    }
    static async Give(player, ammount) {
        return await PlayerData.set(player, 'pRespect', parseInt(await PlayerData.get(player[i], 'pRespect')) + parseInt(ammount), true)
    }
    static async Set(player, ammount) {
        return await PlayerData.set(player, 'pRespect', parseInt(ammount), true)
    }
    static async Take(player) {
        return await PlayerData.set(player, 'pRespect', parseInt(await PlayerData.get(player[i], 'pRespect')) - parseInt(ammount), true)
    }

}