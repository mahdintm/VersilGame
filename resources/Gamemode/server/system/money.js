import { PlayerData } from "./account";

export class money {
    static async set(player, ammount) {
        await PlayerData.set(
            player,
            "pMoney",
            parseInt(ammount),
            true
        )
    }
    static async get(player) {
        return parseInt(await PlayerData.get(
            player,
            "pMoney"
        ))
    }
    static async take(player, ammount) {
        await PlayerData.set(
            player,
            "pMoney",
            parseInt(await PlayerData.get(player, "pMoney")) - parseInt(ammount),
            true
        )
    }
    static async give(player, ammount) {
        await PlayerData.set(
            player,
            "pMoney",
            parseInt(await PlayerData.get(player, "pMoney")) + parseInt(ammount),
            true
        )
    }
}