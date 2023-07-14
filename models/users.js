import { db_conn } from "../database.js";

//Create
export function createUser(first_name, last_name, user_role, username, password) {
   
    return db_conn.query(
        `
        INSERT INTO users 
        (user_first_name, user_last_name, user_role, user_username, user_password)
        VALUES (?, ?, ?, ?, ?)
    `, 
    [first_name, last_name, user_role, username, password]
    );
}

//Read
export function getAllUsers() {
    return db_conn.query(`SELECT * FROM users`);
}

export function getUserById(user_id) {
    return db_conn.query(`SELECT * FROM users WHERE user_id = ?`, [user_id]);
}

export function getUserByUsername(username) {
    return db_conn.query(`SELECT * FROM users WHERE user_username = ?`, [username]);
}


//Update
export function updateUserById(user_id, first_name, last_name, user_role, username, password) {
    return db_conn.query(`
    UPDATE users
    SET user_first_name = ?, user_last_name = ?, user_role = ?, user_username = ?, user_password = ?
    WHERE user_id = ?
    `, 
    [first_name, last_name, user_role, username, password, user_id]
    );
}


//Delete
export function deleteUserById(user_id) {
    return db_conn.query(`DELETE FROM users WHERE user_id = ?`, [user_id]);
}