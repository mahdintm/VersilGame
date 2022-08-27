export class VirtualWorld {
    static async set(player, vmid) {
        player.dimension = vmid
        await player.setSyncedMeta("dimension", vmid)
    }
}