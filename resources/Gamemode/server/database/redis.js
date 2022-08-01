import { createClient } from 'redis';
const client = createClient({
    url: 'redis://192.168.90.15:6379'
});
client.on('connect', function () {
    console.log('Redis Connected!');
});
client.on('error', (err) => console.log('Redis Error', err));
await client.connect();
export class redisDB {
    /**
     * Get Data From Redis
     * @param {string} dbname ServerSettings||PlayerData||VehicleData||AdminCommands
     * @param {string} Key anythings
     * @returns value
     */
    static async get(dbname, Key) {
        switch (dbname) {
            case "ServerSettings":
                await client.select(1);
                return JSON.parse(await client.get(Key))
            case "PlayerData":
                await client.select(2);
                return JSON.parse(await client.get(Key))
            case "VehicleData":
                await client.select(3);
                return JSON.parse(await client.get(Key))
            case "AdminCommands":
                await client.select(4);
                return JSON.parse(await client.get(Key))
            default:
                console.log("invalid DatabaseName")
                break;
        }
        return JSON.parse(await client.get(Key))
    }
    /**
     * Set Data On Redis
     * @param {string} dbname ServerSettings||PlayerData||VehicleData||AdminCommands
     * @param {*} Key 
     * @param {*} Value 
     * @returns 
     */
    static async set(dbname, Key, Value) {
        switch (dbname) {
            case "ServerSettings":
                await client.select(1);
                return await client.set(Key, JSON.stringify(Value));
            case "PlayerData":
                await client.select(2);
                return await client.set(Key, JSON.stringify(Value));
            case "VehicleData":
                await client.select(3);
                return await client.set(Key, JSON.stringify(Value));
            case "AdminCommands":
                await client.select(4);
                return await client.set(Key, JSON.stringify(Value));
            default:
                console.log("invalid DatabaseName")
                break;
        }
    }
}

//dbs
//0:Kosesher //**mahz**
//1:ServerSttings
//2:PlayerData
//3:VehicleData
//4:AdminCommands