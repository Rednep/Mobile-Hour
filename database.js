import mysql from "mysql2/promise"

export const db_conn = mysql.createPool({
    host: "localhost",
    port: 3307,
    user: "mobile-hour",
    password: "abc123",
    database: "mobile-hour",
});



//db_conn.query("SELECT * FROM staff WHERE staff_last_name = 'doe'")