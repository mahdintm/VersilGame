import * as alt from 'alt'
let lastpos, lastrot, time, isAFk = false, isChat = false
lastpos = alt.Player.local.pos
lastrot = alt.Player.local.rot
alt.setInterval(() => {
    let player = alt.Player.local
    if ((lastpos.x == player.pos.x && lastrot.z == player.rot.z) || (isChat == false && player.vehicle != null && player.seat <= 2)) {
        isAFk = true
        time += 10000
    } else {
        isChat = false
        isAFk = false
        time = 0
        lastpos = player.pos
        lastrot = player.rot
    }
}, 10000);




