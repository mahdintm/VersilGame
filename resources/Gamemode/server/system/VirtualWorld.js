export class VirtualWorld {
    static set(player, vmid) {
        player.dimension = vmid
        player.setSyncedMeta("dimension", vmid)
    }
}