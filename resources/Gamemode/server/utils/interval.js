import { StaffPoint } from "../system/staff";

setInterval(async () => {
    let timeNow = new Date();
    let nowHoure = timeNow.getHours();
    let nowMinute = timeNow.getMinutes();
    let nowSecond = timeNow.getSeconds();
    //rase har saat
    if (nowMinute < 1 && nowSecond < 1) {
        //rase har 24saat
        if (nowHoure == 24) {
            StaffPoint.updateDate()
        }
        //rase har saat
        // payday()
    }
    //rase har daqiqe
    if (nowSecond < 1) {
        StaffPoint.SyncToDB()
    }
    //rase har sanie

}, 1000)