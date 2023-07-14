import { db_conn } from "../database.js";

//Read
export function getAllChanges() {
    return db_conn.query(`
    SELECT * FROM changelog
    INNER JOIN users ON changelog.changelog_user_id = users.user_id
    `);
}


// Create
export function createChangeUser(user_id, description) {
    return db_conn.query(`
    INSERT INTO changelog (changelog_change_date, changelog_change_description, changelog_user_id, changelog_product_id)
    VALUES(NOW(), ?, ?, 0)
    `, 
        [description, user_id]
    );
}

export function createChangeProduct(user_id, description, product_id) {
    return db_conn.query(`
    INSERT INTO changelog (changelog_user_id, changelog_change_date, changelog_change_description, changelog_product_id)
    VALUES(?, NOW(), ?, ?)
    `, 
        [user_id, description, product_id]
    );
}