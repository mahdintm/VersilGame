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
const pool_RP = createPool({
    host: process.env.Host_MYSQL,
    user: process.env.Username_MYSQL,
    password: process.env.Password_MYSQL,
    database: process.env.Database_MYSQL_RP,
    port: process.env.Port_MYSQL
});
const pool_RPG = createPool({
    host: process.env.Host_MYSQL,
    user: process.env.Username_MYSQL,
    password: process.env.Password_MYSQL,
    database: process.env.Database_MYSQL_RPG,
    port: process.env.Port_MYSQL
});
const pool_LOG = createPool({
    host: process.env.Host_MYSQL,
    user: process.env.Username_MYSQL,
    password: process.env.Password_MYSQL,
    database: process.env.Database_MYSQL_LOG,
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
export async function sql(in_database, sql_command) {
    try {
        switch (in_database) {
            case "main":
                const [rows_Main, fields_Main] = await pool_Main.promise().query(sql_command);
                if (rows_Main.length == 1) {
                    return rows_Main[0];
                } else {
                    return rows_Main;
                }
            case "rpg":
                const [rows_rpg, fields_rpg] = await pool_RPG.promise().query(sql_command);
                if (rows_rpg.length == 1) {
                    return rows_rpg[0];
                } else {
                    return rows_rpg;
                }
            case "rp":
                const [rows_rp, fields_rp] = await pool_RP.promise().query(sql_command);
                if (rows_rp.length == 1) {
                    return rows_rp[0];
                } else {
                    return rows_rp;
                }
            case "log":
                const [rows_log, fields_log] = await pool_LOG.promise().query(sql_command);
                if (rows_log.length == 1) {
                    return rows_log[0];
                } else {
                    return rows_log;
                }
            default:
                break;
        }

    } catch (error) {
        logger.addlog.server({
            locatin: "Server->db-sql()",
            message: error
        })
    }
}

export default { sql };