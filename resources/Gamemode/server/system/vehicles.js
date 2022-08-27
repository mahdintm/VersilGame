import * as alt from 'alt';
import { sql } from '../database/mysql';
import { vehicleObject } from '../utils/VehicleList';
import { PlayerData } from './account'
//Data
var staticcar = [],
    staticboat = [],
    staticcycle = [],
    staticmotor = [],
    staticflying = [],
    vehicles = {},
    Ids = 0,
    platestaticveh = 0,
    platefactionveh = {
        i: 0,
        1: { prefix: "PD", i: 0 },
        2: { prefix: "FBI", i: 0 },
        3: { prefix: "Sherif", i: 0 },
        4: { prefix: "Medic", i: 0 },
    },
    VehicleEngineON = [],
    GameID = {}

export let LoadedVehicels = false
//GetStaticVehicleList
vehicleObject.filter(function (v, i) {
    vehicleObject[i]["hash"] = alt.hash(v.name);
    if (v.isFreeVehicle === true) {
        switch (v.type) {
            case "driving":
                staticcar.push(v.name);
                break;
            case "sailing":
                staticboat.push(v.name);
                break;
            case "riding":
                staticcycle.push(v.name);
                break;
            case "motor":
                staticmotor.push(v.name);
                break;
            case "flying":
                staticflying.push(v.name);
                break;
            default:
                break;
        }
    }
});
export class VehicleClass {
    /**
     * for get detail vehicle
     * @param {string} VehicleModel 
     * @returns {obj} vehicle data
     */
    static async GetVehicleDetail(VehicleModel) {
        return vehicleObject.filter((v, i) => v.name == VehicleModel)[0]
    };
    static gameid = {
        GetVehicleFromID(id) {
            return GameID[id]
        },
        newid(vehicle) {
            const allvehs = alt.Vehicle.all
            for (let i = 0; i < allvehs.length; i++) {
                if (GameID[i] == undefined) continue;
                return GameID[i] = vehicle.id
            }
        }
    };
    /**
     * get random vehicle model static
     * @param {string} Type driving | sailing | riding | motor | flying
     * @returns vehicle model 
     */
    static async GetRandomModel(Type) {
        switch (Type) {
            case "driving":
                return staticcar[Math.floor(Math.random() * (staticcar.length))]
            case "sailing":
                return staticboat[Math.floor(Math.random() * (staticboat.length))]
            case "riding":
                return staticcycle[Math.floor(Math.random() * (staticcycle.length))]
            case "motor":
                return staticmotor[Math.floor(Math.random() * (staticmotor.length))]
            case "flying":
                return staticflying[Math.floor(Math.random() * (staticflying.length))]
            default:
                break;
        }
    };
    static data = {
        /**
         * 
         * @param {object} vehicle 
         * @param {string} data 
         * @returns data
         */
        get: async (vehicle, data) => {
            const allvehs = await alt.Vehicle.all;
            for (let i = 0; i < allvehs.length; i++) {
                if (await vehicles[vehicle.id] != undefined) {
                    return await vehicles[vehicle.id][data]
                } else {
                    return await vehicle.destroy()
                }
            }
        },
        /**
         * 
         * @param {object} vehicle 
         * @param {string} data 
         * @param {value} value 
         * @returns 
         */
        set: async (vehicle, data, value) => {
            const allvehs = await alt.Vehicle.all;
            for (let i = 0; i < allvehs.length; i++) {
                if (await vehicles[vehicle.id] != undefined) {
                    vehicles[vehicle.id][data] = value
                    return await vehicles[vehicle.id][data]
                } else {
                    return await vehicle.destroy()
                }
            }
        }
    }
    static plate = {
        /**
         * for get new palte Staic Vehicle
         * @returns {string} PlateNumber
         */
        static() {
            platestaticveh++;
            let plate = `STV ${platestaticveh}`;
            return plate
        },
        /**
         * for get new palte Faction Vehicle
         * @param {number} factionid factionID
         * @returns {string} PlateNumber
         */
        async faction(factionid) {
            platefactionveh.i++;
            platefactionveh[factionid].i++;
            let plate = `${platefactionveh[factionid].prefix} ${platefactionveh[factionid].i}`;
            return plate;
        }
    };
    static create = {
        /**
         * for create static vehicle
         * @param {object} player altv player object
         * @param {string} StaticType driving | sailing | riding | motor | flying
         */
        async static(player, StaticType) {
            let VehicleModel = await VehicleClass.GetRandomModel(StaticType)
            const NewVehicle = await new alt.Vehicle(VehicleModel, player.pos.x, player.pos.y, player.pos.z, player.rot.x, player.rot.y, player.rot.z);
            let newsql = await sql(`INSERT INTO Vehicles (model,pos,type,statictype) VALUES ("random",'${JSON.stringify({ x: player.pos.x, y: player.pos.y, z: player.pos.z, rx: player.rot.x, ry: player.rot.y, rz: player.rot.z })}',"static","${StaticType}")`)
            let vehdet = await VehicleClass.GetVehicleDetail(VehicleModel)
            NewVehicle.manualEngineControl = true
            vehicles[NewVehicle.id] = {
                model: VehicleModel,
                type: "static",
                pos: {
                    x: player.pos.x,
                    y: player.pos.y,
                    z: player.pos.z,
                    rx: player.rot.x,
                    ry: player.rot.y,
                    rz: player.rot.z,
                },
                plate: NewVehicle.numberPlateText = VehicleClass.plate.static(),
                gameid: await VehicleClass.gameid.newid(NewVehicle),
                maxspeed: vehdet.MaxSpeed,
                maxfuel: vehdet.MaxFuel,
                fuel: vehdet.MaxFuel,
                consumptiongas: vehdet.ConsumptionGas,
                owner: -1, //-1 for server 
                options: {
                    mods: [],
                    neon: {
                        position: {}, // { left: Boolean, right: Boolean, front: Boolean, back: Boolean }
                        neonColor: {} // { r: (0 - 255), g: (0 - 255), b: (0 - 255), a: (0.0 - 1.0) }
                    },
                    PrimaryColor: 0, // 0 - 159
                    SecondaryColor: 0, // 0 - 159
                    pearlColor: 0, // 0 - 159
                    windowTint: 0,
                    dirtLevel: 0,
                },
                engine: false, // Boolean
                sqlid: newsql.insertId,
                factionid: -1, // -1 for none faction
            }
        },
        async faction(player, FactionNumber, Rank_Req, Model) {
            let VehicleModel = Model;
            const NewVehicle = await new alt.Vehicle(VehicleModel, player.pos.x, player.pos.y, player.pos.z, player.rot.x, player.rot.y, player.rot.z);
            let newsql = await sql(`INSERT INTO Vehicles (model,pos,type,statictype) VALUES (${VehicleModel},'${JSON.stringify({ x: player.pos.x, y: player.pos.y, z: player.pos.z, rx: player.rot.x, ry: player.rot.y, rz: player.rot.z })}',"faction","${sttype}")`)
            let vehdet = await VehicleClass.GetVehicleDetail(VehicleModel)
            NewVehicle.manualEngineControl = true
            vehicles[NewVehicle.id] = {
                model: VehicleModel,
                type: "faction",
                pos: {
                    x: player.pos.x,
                    y: player.pos.y,
                    z: player.pos.z,
                    rx: player.rot.x,
                    ry: player.rot.y,
                    rz: player.rot.z,
                },
                plate: NewVehicle.numberPlateText = VehicleClass.faction(FactionNumber),
                gameid: await VehicleClass.id(NewVehicle.id),
                maxspeed: vehdet.MaxSpeed,
                maxfuel: vehdet.MaxFuel,
                fuel: vehdet.MaxFuel,
                consumptiongas: vehdet.ConsumptionGas,
                owner: -1, //-1 for server 
                options: {
                    mods: [],
                    neon: {
                        position: {}, // { left: Boolean, right: Boolean, front: Boolean, back: Boolean }
                        neonColor: {} // { r: (0 - 255), g: (0 - 255), b: (0 - 255), a: (0.0 - 1.0) }
                    },
                    PrimaryColor: 0, // 0 - 159
                    SecondaryColor: 0, // 0 - 159
                    pearlColor: 0, // 0 - 159
                    windowTint: 0,
                    dirtLevel: 0,
                },
                engine: false, // Boolean
                sqlid: newsql.insertId,
                factionid: FactionNumber, // -1 for none faction
            }
        },
        async admin(player, Model) {
            let VehicleModel = Model;
            const NewVehicle = await new alt.Vehicle(VehicleModel, player.pos.x, player.pos.y, player.pos.z, player.rot.x, player.rot.y, player.rot.z);
            let vehdet = await VehicleClass.GetVehicleDetail(VehicleModel)
            NewVehicle.manualEngineControl = true
            let Plate = await PlayerData.get(player, "pAdmin") == 10 ? NewVehicle.numberPlateText = "Owner" : NewVehicle.numberPlateText = "Admin Veh"
            vehicles[NewVehicle.id] = {
                model: VehicleModel,
                type: "admin",
                pos: {
                    x: player.pos.x,
                    y: player.pos.y,
                    z: player.pos.z,
                    rx: player.rot.x,
                    ry: player.rot.y,
                    rz: player.rot.z,
                },
                plate: Plate,
                gameid: await VehicleClass.gameid.newid(NewVehicle),
                maxspeed: vehdet.MaxSpeed,
                maxfuel: vehdet.MaxFuel,
                fuel: vehdet.MaxFuel,
                consumptiongas: vehdet.ConsumptionGas,
                owner: player.id, //-1 for server 
                options: {
                    mods: [],
                    neon: {
                        position: {}, // { left: Boolean, right: Boolean, front: Boolean, back: Boolean }
                        neonColor: {} // { r: (0 - 255), g: (0 - 255), b: (0 - 255), a: (0.0 - 1.0) }
                    },
                    PrimaryColor: 0, // 0 - 159
                    SecondaryColor: 0, // 0 - 159
                    pearlColor: 0, // 0 - 159
                    windowTint: 0,
                    dirtLevel: 0,
                },
                engine: false, // Boolean
                sqlid: null,
                factionid: -1, // -1 for none faction
            }
            await player.setIntoVehicle(NewVehicle, 1)
        }
    };
    static load = {
        /**
         * for load static vehicle
         * @param {object} data data database
         */
        async static(data) {
            let VehicleModel = await VehicleClass.GetRandomModel(data.statictype)
            let position = JSON.parse(data.pos)
            const NewVehicle = await new alt.Vehicle(VehicleModel, position.x, position.y, position.z, position.rx, position.ry, position.rz);
            let vehdet = await VehicleClass.GetVehicleDetail(VehicleModel)
            NewVehicle.manualEngineControl = true
            vehicles[NewVehicle.id] = {
                model: VehicleModel,
                type: "static",
                pos: position,
                plate: NewVehicle.numberPlateText = VehicleClass.plate.static(),
                gameid: await VehicleClass.gameid.newid(NewVehicle),
                maxspeed: vehdet.MaxSpeed,
                maxfuel: vehdet.MaxFuel,
                fuel: vehdet.MaxFuel,
                consumptiongas: vehdet.ConsumptionGas,
                owner: -1, //-1 for server 
                options: {
                    mods: [],
                    neon: {
                        position: {}, // { left: Boolean, right: Boolean, front: Boolean, back: Boolean }
                        neonColor: {} // { r: (0 - 255), g: (0 - 255), b: (0 - 255), a: (0.0 - 1.0) }
                    },
                    PrimaryColor: 0, // 0 - 159
                    SecondaryColor: 0, // 0 - 159
                    pearlColor: 0, // 0 - 159
                    windowTint: 0,
                    dirtLevel: 0,
                },
                engine: false, // Boolean
                sqlid: data.id,
                factionid: -1, // -1 for none faction
            }
        },
        /**
         * for load faction vehicle
         * @param {object} data data database
         */
        async faction(data) {
            let VehicleModel = data.model
            let position = JSON.parse(data.pos)
            const NewVehicle = await new alt.Vehicle(VehicleModel, position.x, position.y, position.z, position.rx, position.ry, position.rz);
            let vehdet = await VehicleClass.GetVehicleDetail(VehicleModel)
            NewVehicle.manualEngineControl = true
            vehicles[NewVehicle.id] = {
                model: VehicleModel,
                type: "faction",
                pos: position,
                plate: NewVehicle.numberPlateText = VehicleClass.plate.faction(data.factionid),
                gameid: await VehicleClass.gameid.newid(NewVehicle),
                maxspeed: vehdet.MaxSpeed,
                maxfuel: vehdet.MaxFuel,
                fuel: vehdet.MaxFuel,
                consumptiongas: vehdet.ConsumptionGas,
                owner: -1, //-1 for server 
                options: {
                    mods: [],
                    neon: {
                        position: {}, // { left: Boolean, right: Boolean, front: Boolean, back: Boolean }
                        neonColor: {} // { r: (0 - 255), g: (0 - 255), b: (0 - 255), a: (0.0 - 1.0) }
                    },
                    PrimaryColor: 0, // 0 - 159
                    SecondaryColor: 0, // 0 - 159
                    pearlColor: 0, // 0 - 159
                    windowTint: 0,
                    dirtLevel: 0,
                },
                engine: false, // Boolean
                sqlid: data.id,
                factionid: data.factionid, // -1 for none faction
            }
        }
    };
    static delete = {
        static: async (vehicle) => {
            let vehicleid = vehicle.id
            if (vehicles[vehicle.id]['type'] == 'static') {
                var index = VehicleEngineON.indexOf(vehicle);
                if (index != -1) VehicleEngineON.splice(index, 1)
                await vehicle.destroy();
                await sql(`delete from Vehicles where id="${vehicles[vehicleid]['sqlid']}"`)
                delete vehicles[vehicleid]
                return true
            } else
                return false
        },
        admin: async (vehicle) => {
            let vehicleid = vehicle.id
            if (vehicles[vehicle.id]['type'] == 'admin') {
                var index = VehicleEngineON.indexOf(vehicle);
                if (index != -1) VehicleEngineON.splice(index, 1)
                await vehicle.destroy();
                delete vehicles[vehicleid]
                return true
            } else
                return false
        },
        faction: async (vehicle) => {
            let vehicleid = vehicle.id
            if (vehicles[vehicle.id]['type'] == 'faction') {
                var index = VehicleEngineON.indexOf(vehicle);
                if (index != -1) VehicleEngineON.splice(index, 1)
                await vehicle.destroy();
                await sql(`delete from Vehicles where id="${vehicles[vehicleid]['sqlid']}"`)
                delete vehicles[vehicleid]
                return true
            } else
                return false
        }
    }
    static respawn = {
        async avehicle(vehicle, force = false, repair = false) {
            if (await vehicle.driver != null && force == false) return
            if (repair == true) await vehicle.repair()
            vehicle.pos = await vehicles[vehicle.id]["pos"]
            vehicle.rot = { x: vehicles[vehicle.id]["pos"].rx, y: vehicles[vehicle.id]["pos"].ry, z: vehicles[vehicle.id]["pos"].rz }
        },
        async allserver(type = "static", force = false, repair = false) {
            const allvehs = await alt.Vehicle.all;
            for (let i = 0; i < allvehs.length; i++) {
                if (await vehicles[allvehs[i].id] == undefined) {
                    await allvehs[i].destroy()
                    continue
                }
                if (await vehicles[allvehs[i].id] == undefined) continue
                if (await allvehs[i].driver != null && force == false) continue
                if (await vehicles[allvehs[i].id]['type'] == type) {
                    await this.avehicle(allvehs[i], force, repair)
                }
            }
        }
    }
    static engine = {
        on: async (Vehicle, state) => {
            if (state == true) {
                if (await VehicleClass.fuel.get(Vehicle) <= 0) return console.log("fuel nadariiiii.")
                VehicleEngineON.push(Vehicle)
                await Vehicle.setSyncedMeta("engin_state", true)
                let allPlayers = await alt.Player.all
                for (let i = 0; i < allPlayers.length; i++) {
                    if (await allPlayers[i].getSyncedMeta('hasLogin') == false) continue
                    if (await allPlayers[i].vehicle != Vehicle) continue
                    await alt.emitClient(allPlayers[i], 'Server:Vehicle:engin', true)
                }
                await VehicleClass.data.set(Vehicle, "engine", true)
            } else {
                var index = VehicleEngineON.indexOf(Vehicle);
                if (index != -1) VehicleEngineON.splice(index, 1)
                await Vehicle.setSyncedMeta("engin_state", false)
                let allPlayers = await alt.Player.all
                for (let i = 0; i < allPlayers.length; i++) {
                    if (await allPlayers[i].getSyncedMeta('hasLogin') == false) continue
                    if (await allPlayers[i].vehicle != Vehicle) continue
                    await alt.emitClient(allPlayers[i], 'Server:Vehicle:engin', false)
                }
                await VehicleClass.data.set(Vehicle, "engine", false)
            }
        }
    }
    static getspeed = (vehicle) => {
        let x = vehicle.velocity.x
        let y = vehicle.velocity.y
        let z = vehicle.velocity.z
        return Math.abs(Math.floor(Math.sqrt(x * x + y * y + z * z) * 3.6))
    }
    static fuel = {
        get: async (vehicle) => {
            return await VehicleClass.data.get(vehicle, "fuel")
        },
        set: async (vehicle, amount) => {
            let fuel = await VehicleClass.data.set(vehicle, "fuel", amount)
            await vehicle.setSyncedMeta('fuel', Math.round(((fuel * 100) / await VehicleClass.data.get(vehicle, 'maxfuel'))));
            return fuel
        },
        take: async (vehicle, amount) => {
            let fuel = await VehicleClass.data.set(vehicle, "fuel", await VehicleClass.data.get(vehicle, "fuel") - amount)
            await vehicle.setSyncedMeta('fuel', Math.round(((fuel * 100) / await VehicleClass.data.get(vehicle, 'maxfuel'))));
            return fuel
        },
        give: async (vehicle, amount) => {
            let fuel = await VehicleClass.data.set(vehicle, "fuel", await VehicleClass.data.get(vehicle, "fuel") + amount)
            await vehicle.setSyncedMeta('fuel', Math.round(((fuel * 100) / await VehicleClass.data.get(vehicle, 'maxfuel'))));
            return fuel
        }
    }
}

setTimeout(async () => {
    let VehicleData_ = await sql(`SELECT * FROM Vehicles`)
    for (let i = 0; i < VehicleData_.length; i++) {
        if (VehicleData_[i] == "") continue
        if (VehicleData_[i].type == "static") await VehicleClass.load.static(VehicleData_[i]);
        if (VehicleData_[i].type == "faction") await VehicleClass.load.faction(VehicleData_[i]);
        if (i == VehicleData_.length - 1) {
            console.log(`${"\x1b[31m"}${platestaticveh} ${"\x1b[32m"} Static vehicle has been Loaded.${"\x1b[37m"}`)
            console.log(`${"\x1b[31m"}${platefactionveh.i} ${"\x1b[32m"} Faction vehicle has been Loaded.${"\x1b[37m"}`)
            await VehicleClass.respawn.allserver('static', true, true)
            await VehicleClass.respawn.allserver('faction', true, true)
            LoadedVehicels = true
        }
    }
}, 1000);

setInterval(async () => {
    VehicleEngineON.filter(async (vehicle, i) => {
        let speed = VehicleClass.getspeed(vehicle);
        let consumption
        if (speed == 0) {
            consumption = 0.000003
        } else if (speed >= 1 && speed <= 99) {
            consumption = ((speed / 10) / (1000000))
        } else if (speed >= 100 && speed <= 180) {
            consumption = ((speed / 7) / (1000000))
        } else {
            consumption = ((speed / 4) / (1000000))
        }
        await VehicleClass.fuel.take(vehicle, consumption)
        if (await VehicleClass.fuel.get(vehicle) <= 0) {
            VehicleClass.engine.on(vehicle, false)
        }
    })
}, 1)

alt.onClient('Client:Vehicle:Engine', (player, vehicle, state) => {
    VehicleClass.engine.on(vehicle, state)
})


// newveh.setWindowOpened(3, true)
// newveh.modKit = newveh.modKitsCount;
// if (newveh.modKitsCount >= 1) {
//     newveh.setMod(22, 1);
//     newveh.headlightColor = 9;
// }
// vehicle.customTires = true;
// vehicle.dirtLevel = 15; //kasifi
// vehicle.flamethrowerActive = true //back fire test----**
// vehicle.getAttached() // **
// vehicle.getAttachedTo() //  **
// vehicle.getBumperDamageLevel //check kardane separ https://altv.stuyk.com/docs/vehicle/getBumperDamageLevel.html
// vehicle.getPartBulletHoles // tedad tir haye dar
// vehicle.handbrakeActive // tormoz dasti

// //range cheragh
// const vehicle = new alt.Vehicle('elegy', 0, 0, 0, 0, 0, 0);
// vehicle.modKit = 1;
// vehicle.setMod(22, 1);
// vehicle.headlightColor = 9;
// let rang = {
//         Darkblue: 1
//         Lightblue: 2
//         Turquoise: 3
//         Green: 4
//         Yellow: 5
//         Gold: 6
//         Orange: 7
//         Red: 8
//         Pink: 9
//         Violet: 10,
//         Purple: 11,
//         Ultraviolet: 12
//     }
//     //-----------
// vehicle.interiorColor = 139; //0-159
// vehicle.lightsMultiplier = 20; // afzeyesh noor cheragh

// vehicle.livery //? ? ? ?
// vehicle.manualEngineControl = 1; // khodkar roshan nashe
// vehicle.neon: { left: boolean, right: boolean, front: boolean, back: boolean };

// //
// vehicle.PrimaryColor = 5; //0-159
// vehicle.SecondaryColor = 5; //0-159
// vehicle.pearlColor = 27; //0-159
// //
// vehicle.roofLivery = 2; //saghf

// /*
// vehicle.setDoorState(0, 0);
// {
//     DriverFront: 0,
//     PassengerFront: 1,
//     DriverRear: 2,
//     PassengerRear: 3,
//     Hood: 4,
//     Trunk: 5
// }
// //0-255*/
// /*
// vehicle.setWindowOpened(2, true); {
//     VEH_EXT_WINDSCREEN: 0,
//     VEH_EXT_WINDSCREEN_R: 1,
//     VEH_EXT_WINDOW_LF: 2,
//     VEH_EXT_WINDOW_RF: 3,
//     VEH_EXT_WINDOW_LR: 4,
//     VEH_EXT_WINDOW_RR: 5,
//     VEH_EXT_WINDOW_LM: 6,
//     VEH_EXT_WINDOW_RM: 7
// }*/

// vehicle.sirenActive = true;
// vehicle.tireSmokeColor: { r: number, g: number, b: number, a: number };
// vehicle.wheelColor = 136; //0-159
// vehicle.windowTint = 2
//     /*
//     {
//         None: 0,
//         PureBlack: 1,
//         DarkSmoke: 2,
//         LightSmoke: 3,
//         Stock: 4,
//         Limo: 5,
//         Green: 6
//     }*/