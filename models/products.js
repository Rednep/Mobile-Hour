import { db_conn } from "../database.js";


//Create
export function createProduct(
    product_id,
    product_name,
    product_model,
    product_manufacturer,
    product_price,
    product_stock,
    product_feature_id,
) {
    return db_conn.query(
        `
        INSERT INTO product (product_id, product_name, product_model, product_manufacturer, product_price, product_stock, product_feature_id) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
        [product_id, product_name, product_model, product_manufacturer, product_price, product_stock, product_feature_id]
    );
}

export function createFeatures(
    feature_weight_g,
    feature_height_mm,
    feature_width_mm,
    feature_depth_mm,
    feature_operating_system,
    feature_screen_size,
    feature_screen_resolution,
    feature_cpu,
    feature_ram,
    feature_storage,
    feature_battery,
    feature_rear_camera,
    feature_front_camera,
) {
    return db_conn.query(
        `
        INSERT INTO features (feature_weight_g, feature_height_mm, feature_width_mm, feature_depth_mm, feature_operating_system, feature_screen_size, feature_screen_resolution, feature_cpu, feature_ram, feature_storage, feature_battery, feature_rear_camera, feature_front_camera) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
            [feature_weight_g,
            feature_height_mm,
            feature_width_mm,
            feature_depth_mm,
            feature_operating_system,
            feature_screen_size,
            feature_screen_resolution,
            feature_cpu,
            feature_ram,
            feature_storage,
            feature_battery,
            feature_rear_camera,
            feature_front_camera,]
    );
}


//Read
export function getAllProducts() {
    return db_conn.query("SELECT * FROM product");
}



export function getProductById(product_id) {
    return db_conn.query("SELECT * FROM product WHERE product_id = ?",
        [product_id]
    );
}


export function getProductsBySearch(search_term) {
    return db_conn.query(
        "SELECT * FROM product WHERE product_name LIKE ? OR product_manufacturer LIKE ?",
        [`%${search_term}%`, `%${search_term}%`]
    );
}

export function getAllProductsWithFeatures() {
    return db_conn.query(`
        SELECT * FROM product 
        INNER JOIN features 
        ON product.product_feature_id = features.feature_id
        `
    );
}

export function getAllProductsWithFeaturesById(product_id) {
    return db_conn.query(`
        SELECT * FROM product 
        INNER JOIN features 
        ON product.product_feature_id = features.feature_id
        WHERE product_id = ?
        `, [product_id]
    );
}



export function getAllOrdersByStatusWithProduct(status) {
    return db_conn.query(
        `
        SELECT * FROM orders
        INNER JOIN products
        ON orders.product_id = products.product_id
        WHERE orders.order_status = ?
    `,
        [status]
    );
}


export function getAllFeatures() {
    return db_conn.query("SELECT * FROM features");
}


export function getFeatureById(feature_id) {
    return db_conn.query("SELECT * FROM features WHERE feature_id = ?",
        [feature_id]
    );
}



//Update
export function updateProductById(
    product_id,
    product_name,
    product_model,
    product_manufacturer,
    product_price,
    product_stock,
) {
    return db_conn.query(
        `
        UPDATE product
        SET product_name = ?, product_model = ?, product_manufacturer = ?, product_price = ?, product_stock = ?
        WHERE product_id = ?
    `,
        [product_name, product_model, product_manufacturer, product_price, product_stock, product_id]
    );
}

export function updateFeaturesById(
    feature_id,
    feature_weight_g,
    feature_height_mm,
    feature_width_mm,
    feature_depth_mm,
    feature_operating_system,
    feature_screen_size,
    feature_screen_resolution,
    feature_cpu,
    feature_ram,
    feature_storage,
    feature_battery,
    feature_rear_camera,
    feature_front_camera,
) {
    return db_conn.query(
    `UPDATE features
    SET feature_weight_g = ?, feature_height_mm = ?, feature_width_mm = ?, feature_depth_mm = ?, feature_operating_system = ?, feature_screen_size = ?, feature_screen_resolution = ?, feature_cpu = ?, feature_ram = ?, feature_storage = ?, feature_battery = ?, feature_rear_camera = ?, feature_front_camera = ?
    WHERE feature_id = ?`,
        [
        feature_weight_g,
        feature_height_mm,
        feature_width_mm,
        feature_depth_mm,
        feature_operating_system,
        feature_screen_size,
        feature_screen_resolution,
        feature_cpu,
        feature_ram,
        feature_storage,
        feature_battery,
        feature_rear_camera,
        feature_front_camera,
        feature_id
        ]
    );
}


//Delete
export function deleteProductById(product_id) {
    return db_conn.query("DELETE FROM product WHERE product_id = ?", [
        product_id,
    ]);
}


export function deleteFeaturesById(feature_id) {
    return db_conn.query("DELETE FROM product WHERE product_id = ?", [
        feature_id,
    ]);
}