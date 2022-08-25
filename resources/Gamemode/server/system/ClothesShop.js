
import * as alt from 'alt'
import { registerCmd } from './chat'
let clothesShop = []
let a = new alt.ColshapeRectangle(82.734, -1386.857, 69.851, -1400.268)

registerCmd("aa", (player) => {

    console.log(a.isEntityIn(player))
})

alt.on('entityEnterColshape', (colshape, entity) => {
    console.log(colshape, entity)
})
