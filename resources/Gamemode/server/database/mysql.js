import { createPool } from 'mysql2';
import dotenv from 'dotenv'
import { logger } from '../system/logger';
dotenv.config();
// create the connection to database
const pool_Main = createPool({
    host: process.env.Host_MYSQL,
    user: process.env.Username_MYSQL,
    password: process.env.Password_MYSQL,
    database: process.env.Database_MYSQL_Main,
    port: process.env.Port_MYSQL
});

pool_Main.on("connected", () => {
    console.log("Connection")
});
/**
 * for run Quary in mysql
 * @param {number} in_database DataBase Main || RP || RPG
 * @param {string} sql_command Mysql Command Line
 * @memberof server/mysql/db.js
 */
export async function sql(sql_command) {
    try {
        const [rows_Main, fields_Main] = await pool_Main.promise().query(sql_command);
        if (rows_Main.length == 1) {
            return rows_Main[0];
        } else {
            return rows_Main;
        }
    } catch (error) {
        logger.addlog.server({
            locatin: "Server->db-sql()",
            message: error
        })
    }
}

export default { sql };