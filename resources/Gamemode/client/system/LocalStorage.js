import * as alt from 'alt';
export class LocalStorage {
    /**
     * for delete all data from LocalStorage Player
     */
    static async DeleteAll() {
        await alt.LocalStorage.deleteAll(); // Deletes all keys from the local storage.
        await alt.LocalStorage.save(); // Saves the changes to the disk.
    };
    /**
     * for delete a data from LocalStorage Player
     * @param {string} key key LocalStorage
     */
    static async Delete(key) {
        await alt.LocalStorage.delete(key); // Deletes the specified key from the local storage.
        await alt.LocalStorage.save();
    };
    /**
     * for get a data from LocalStorage Player
     * @param {string} key key LocalStorage
     * @returns {*} value
     */
    static async get(key) {
        return await alt.LocalStorage.get(key); // Gets the value from the specified key in the local storage.
    };
    /**
     * for set a data from LocalStorage Player
     * @param {string} key key LocalStorage
     * @param {*} value value
     * @returns {*} value
     */
    static async set(key, value) {
        await alt.LocalStorage.set(key, value); // Sets the specified key to the specified value in the local storage.
        await alt.LocalStorage.save(); // Saves the changes to the disk.
        return value;
    };
}