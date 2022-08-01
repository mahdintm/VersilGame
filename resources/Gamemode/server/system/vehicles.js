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
    vehicles = { rp: {}, rpg: {} },
    Ids = { rp: 0, rpg: 0 },
    platestaticveh = { rp: 0, rpg: 0 },
    platefactionveh = {
        rp: {
            i: 0,
            1: { prefix: "PD", i: 0 },
            2: { prefix: "FBI", i: 0 },
            3: { prefix: "Sherif", i: 0 },
            4: { prefix: "Medic", i: 0 },
        },
        rpg: {
            i: 0,
            1: { prefix: "PD", i: 0 },
            2: { prefix: "FBI", i: 0 },
            3: { prefix: "Sherif", i: 0 },
            4: { prefix: "Medic", i: 0 },
        }
    },
    VehicleEngineON = [],
    GameID = { rp: {}, rpg: {} }

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
        GetVehicleFromID(from, id) {
            return GameID[from, id]
        },
        newid(from, vehicle) {
            const allvehs = alt.Vehicle.all
            for (let i = 0; i < allvehs.length; i++) {
                if (GameID[from][i] == undefined) continue;
                return GameID[from][i] = vehicle
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
                if (await vehicles["rp"][vehicle.id] != undefined) {
                    return await vehicles["rp"][vehicle.id][data]
                } else if (await vehicles["rpg"][vehicle.id] != undefined) {
                    return await vehicles["rpg"][vehicle.id][data]
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
                if (await vehicles["rp"][vehicle.id] != undefined) {
                    vehicles["rp"][vehicle.id][data] = value
                    return await vehicles["rp"][vehicle.id][data]
                } else if (await vehicles["rpg"][vehicle.id] != undefined) {
                    vehicles["rpg"][vehicle.id][data] = value
                    return await vehicles["rpg"][vehicle.id][data]
                } else {
                    return await vehicle.destroy()
                }
            }
        }
    }
    static plate = {
        /**
         * for get new palte Staic Vehicle
         * @param {string} from rp || rpg
         * @returns {string} PlateNumber
         */
        async static(from) {
            platestaticveh[from]++;
            return `STV ${platestaticveh[from]}`;
        },
        /**
         * for get new palte Faction Vehicle
         * @param {string} from rp || rpg
         * @param {number} factionid factionID
         * @returns {string} PlateNumber
         */
        async faction(from, factionid) {
            platefactionveh[from].i++;
            platefactionveh[from][factionid].i++;
            let plate = `${platefactionveh[from][factionid].prefix} ${platefactionveh[from][factionid].i}`;
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
            let PlayerInServer = await player.getSyncedMeta('inServer')
            let VehicleModel = await VehicleClass.GetRandomModel(StaticType)
            const NewVehicle = await new alt.Vehicle(VehicleModel, player.pos.x, player.pos.y, player.pos.z, player.rot.x, player.rot.y, player.rot.z);
            PlayerInServer == "rpg" ? NewVehicle.dimension = 1 : NewVehicle.dimension = 2;
            let newsql = await sql(PlayerInServer, `INSERT INTO Vehicles (model,pos,type,statictype) VALUES ("random",'${JSON.stringify({ x: player.pos.x, y: player.pos.y, z: player.pos.z, rx: player.rot.x, ry: player.rot.y, rz: player.rot.z })}',"static","${sttype}")`)
            let vehdet = await VehicleClass.GetVehicleDetail(VehicleModel)
            vehicles[PlayerInServer][NewVehicle.id] = {
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
                plate: NewVehicle.numberPlateText = VehicleClass.plate.static(PlayerInServer),
                gameid: await VehicleClass.id(PlayerInServer, NewVehicle.id),
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
        async faction(player, FactionNumber, Model) {
            let PlayerInServer = await player.getSyncedMeta('inServer')
            let VehicleModel = Model;
            const NewVehicle = await new alt.Vehicle(VehicleModel, player.pos.x, player.pos.y, player.pos.z, player.rot.x, player.rot.y, player.rot.z);
            PlayerInServer == "rpg" ? NewVehicle.dimension = 1 : NewVehicle.dimension = 2;
            let newsql = await sql(PlayerInServer, `INSERT INTO Vehicles (model,pos,type,statictype) VALUES (${VehicleModel},'${JSON.stringify({ x: player.pos.x, y: player.pos.y, z: player.pos.z, rx: player.rot.x, ry: player.rot.y, rz: player.rot.z })}',"faction","${sttype}")`)
            let vehdet = await VehicleClass.GetVehicleDetail(VehicleModel)
            vehicles[PlayerInServer][NewVehicle.id] = {
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
                plate: NewVehicle.numberPlateText = VehicleClass.faction(PlayerInServer, FactionNumber),
                gameid: await VehicleClass.id(PlayerInServer, NewVehicle.id),
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
            let PlayerInServer = await player.getSyncedMeta('inServer')
            let VehicleModel = Model;
            const NewVehicle = await new alt.Vehicle(VehicleModel, player.pos.x, player.pos.y, player.pos.z, player.rot.x, player.rot.y, player.rot.z);
            PlayerInServer == "rpg" ? NewVehicle.dimension = 1 : NewVehicle.dimension = 2;
            let newsql = await sql(PlayerInServer, `INSERT INTO Vehicles (model,pos,type,statictype) VALUES (${VehicleModel},'${JSON.stringify({ x: player.pos.x, y: player.pos.y, z: player.pos.z, rx: player.rot.x, ry: player.rot.y, rz: player.rot.z })}',"faction","${sttype}")`)
            let vehdet = await VehicleClass.GetVehicleDetail(VehicleModel)
            let Plate = await PlayerData.get(PlayerInServer, player, "pAdmin") == 10 ? NewVehicle.numberPlateText = "Owner" : NewVehicle.numberPlateText = "Admin Veh"

            vehicles[PlayerInServer][NewVehicle.id] = {
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
                plate: Plate,
                gameid: await VehicleClass.id(PlayerInServer, NewVehicle.id),
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
                sqlid: newsql.insertId,
                factionid: -1, // -1 for none faction
            }
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
            data.InServer == "rpg" ? NewVehicle.dimension = 1 : NewVehicle.dimension = 2;
            let vehdet = await VehicleClass.GetVehicleDetail(VehicleModel)
            NewVehicle.manualEngineControl = true
            vehicles[data.InServer][NewVehicle.id] = {
                model: VehicleModel,
                type: "static",
                pos: position,
                plate: NewVehicle.numberPlateText = VehicleClass.plate.static(data.InServer),
                gameid: await VehicleClass.gameid.newid(data.InServer, NewVehicle),
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
            data.InServer == "rpg" ? NewVehicle.dimension = 1 : NewVehicle.dimension = 2;
            let vehdet = await VehicleClass.GetVehicleDetail(VehicleModel)
            vehicles[data.InServer][NewVehicle.id] = {
                model: VehicleModel,
                type: "faction",
                pos: position,
                plate: NewVehicle.numberPlateText = await VehicleClass.plate.faction(data.InServer, data.factionid),
                // gameid: await VehicleClass.id("rpg", NewVehicle.id),
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
    static respawn = {
        async avehicle(from, vehicle, force = false, repair = false) {
            if (await vehicle.driver == null && force == false) return
            if (repair == true) await vehicle.repair()
            vehicle.pos = await vehicles[from][vehicle.id]["pos"]
            vehicle.rot = { x: vehicles[from][vehicle.id]["pos"].rx, y: vehicles[from][vehicle.id]["pos"].ry, z: vehicles[from][vehicle.id]["pos"].rz }
        },
        async allserver(from, type = "static", force = false, repair = false) {
            const allvehs = await alt.Vehicle.all;
            for (let i = 0; i < allvehs.length; i++) {
                if (await vehicles["rp"][allvehs[i].id] == undefined && await vehicles["rpg"][allvehs[i].id] == undefined) {
                    await allvehs[i].destroy()
                    continue
                }
                if (await vehicles[from][allvehs[i].id] == undefined) continue
                if (await allvehs[i].driver != null && force == false) continue
                if (await vehicles[from][allvehs[i].id]['type'] == type) {
                    await this.avehicle(from, allvehs[i], force, repair)
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
        }
    }
}


setTimeout(async () => {
    let rpgData = await sql("rpg", `SELECT * FROM Vehicles`)
    let rpData = await sql("rp", `SELECT * FROM Vehicles`)
    for (let i = 0; i < rpgData.length; i++) {
        if (rpgData[i] == "") return
        rpgData[i]['InServer'] = "rpg";
        if (rpgData[i].type == "static") await VehicleClass.load.static(rpgData[i]);
        if (rpgData[i].type == "faction") await VehicleClass.load.faction(rpgData[i]);
        if (i == rpgData.length - 1) {
            console.log(`${"\x1b[94m"}RPG: ${"\x1b[31m"}${platestaticveh.rpg} ${"\x1b[32m"} Static vehicle has been Loaded.${"\x1b[37m"}`)
            console.log(`${"\x1b[94m"}RPG: ${"\x1b[31m"}${platefactionveh.rpg.i} ${"\x1b[32m"} Faction vehicle has been Loaded.${"\x1b[37m"}`)
            await VehicleClass.respawn.allserver("rpg", 'static', true, true)
            await VehicleClass.respawn.allserver("rpg", 'faction', true, true)
        }
    }

    for (let i = 0; i < rpData.length; i++) {
        if (rpData[i] == "") return
        rpData[i]['InServer'] = "rp";
        if (rpData[i].type == "static") await VehicleClass.load.static(rpData[i]);
        if (rpData[i].type == "faction") await VehicleClass.load.faction(rpData[i]);
        if (i == rpData.length - 1) {
            console.log(`${"\x1b[94m"}RP: ${"\x1b[31m"}${platestaticveh.rp}${"\x1b[32m"} Static vehicle has been Loaded.${"\x1b[37m"}`)
            console.log(`${"\x1b[94m"}RP: ${"\x1b[31m"}${platefactionveh.rp.i}${"\x1b[32m"} Faction vehicle has been Loaded.${"\x1b[37m"}`)
            await VehicleClass.respawn.allserver("rp", 'static', true, true)
            await VehicleClass.respawn.allserver("rp", 'faction', true, true)
        }
    }
}, 10000);

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
        if (await VehicleClass.data.get(vehicle, "fuel") <= 0) {
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