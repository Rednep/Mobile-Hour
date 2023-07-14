import { db_conn } from "../database.js";

// Create

// Review this once views are complete!!!
export function createOrder(
    order_id,
    customer_first_name,
    customer_last_name,
    customer_address,
    customer_email,
    customer_phone,

) {
    return db_conn.query(
        `
        INSERT INTO orders (order_date, order_status, order_customer_first_name, order_customer_last_name, order_customer_address, order_customer_email, order_customer_phone) 
        VALUES (NOW(), 'Pending', ?, ?, ?, ?, ?) 
    `,
        [
            order_id,
            customer_first_name,
            customer_last_name,
            customer_address,
            customer_email,
            customer_phone,
        ]
    );
}

export function createOrderLines(
    order_id,
    product_id,
    product_quantity,
) {
    return db_conn.query(
        `
        INSERT INTO order_lines (order_line_order_id, order_line_product_id, order_line_quantity) 
        VALUES (?,?,1) 
    `,
        [
            order_id,
            product_id,
            product_quantity,
        ]
    );
}




//Read

export function getAllOrders() {
    return db_conn.query("SELECT * FROM orders");
}



// *********************Probably wrong!!!******************
export function getAllOrdersByStatusWithProduct(status) {
    return db_conn.query(
        `
        SELECT * FROM order_lines
        INNER JOIN product
        ON order_lines.order_line_product_id = product.product_id
        INNER JOIN orders
        ON order_lines.order_line_order_id = orders.order_id
        WHERE orders.order_status = ?
    `,
        [status]
    );
}


export function getOrderWithProductByOrderId(order_id) {
    return db_conn.query(
        `
        SELECT * FROM orders
        INNER JOIN order_lines
        ON order_id = order_lines.order_line_order_id
        INNER JOIN product
        ON order_lines.order_line_product_id = product.product_id
        WHERE orders.order_id = ?
        `,
        [order_id]
    );
}


export function getOrderById(order_id) {
    return db_conn.query("SELECT * FROM orders WHERE order_id = ?", [order_id]);
}


// *********************Probably wrong!!!******************
export function getOrderWithProductById(order_id) {
    return db_conn.query(
        `
        SELECT *
        FROM orders
        INNER JOIN products
        ON orders.product_id = products.product_id
        WHERE orders.order_id = ?
    `,
        [order_id]
    );
}




//Update

export function updateOrderStatusById(order_id, status) {
    return db_conn.query(
        `
        UPDATE orders
        SET order_status = ?
        WHERE order_id = ?
    `,
        [status, order_id]
    );
}

