import { PayDay } from "../system/payday";
import { StaffSystem } from "../system/staff";

setInterval(async () => {
    let timeNow = new Date();
    let nowHoure = timeNow.getHours();
    let nowMinute = timeNow.getMinutes();
    let nowSecond = timeNow.getSeconds();
    //rase har saat
    if (nowMinute < 1 && nowSecond < 1) {
        //rase har 24saat
        if (nowHoure == 24) {
            StaffSystem.updateDate()
        }
        //rase har saat
        PayDay()
    }
    //rase har daqiqe
    if (nowSecond < 1) {
        StaffSystem.SyncToDB()
    }
    //rase har sanie

}, 1000)