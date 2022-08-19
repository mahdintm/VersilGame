import { PlayerData } from "./account";

export class Gold {
    static async set(player, ammount) {
        await PlayerData.set(
            player,
            "pGold",
            parseInt(ammount),
            true
        )
    }
    static async get(player) {
        return parseInt(await PlayerData.get(
            player,
            "pGold"
        ))
    }
    static async take(player, ammount) {
        await PlayerData.set(
            player,
            "pGold",
            parseInt(await PlayerData.get(player, "pGold")) - parseInt(ammount),
            true
        )
    }
    static async give(player, ammount) {
        await PlayerData.set(
            player,
            "pGold",
            parseInt(await PlayerData.get(player, "pGold")) + parseInt(ammount),
            true
        )
    }
}