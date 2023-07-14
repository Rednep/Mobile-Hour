import express from "express";
import access_control from "../access_control.js";
import validator from "validator";
import { createOrder, createOrderLines, getOrderWithProductByOrderId, updateOrderStatusById, getAllOrdersByStatusWithProduct } from "../models/orders.js";
//import express, { response } from "express";


const orderController = express.Router();


orderController.post("/create_order", (request, response) => {
    if (request.body) {
        const order_details = request.body;

        if (!/[0-9]{1,}/.test(order_details.product_id)) {
            response.render("status.ejs", {
                status: "invalid product ID",
                message: "Please pick another product.",
            });
            return;
        }

        if (!/[a-zA-Z-]{2,}/.test(order_details.order_customer_first_name)) {
            response.render("status.ejs", {
                status: "Invalid first name",
                message: "First name must be letters",
            });
            return;
        }

        if (!/[a-zA-Z-]{2,}/.test(order_details.order_customer_last_name)) {
            response.render("status.ejs", {
                status: "Invalid last name",
                message: "Last name must be letters",
            });
            return;
        }

        if (
            !/(^\({0,1}((0|\+61)(2|4|3|7|8)){0,1}\){0,1}(\ |-){0,1}[0-9]{2}(\ |-){0,1}[0-9]{2}(\ |-){0,1}[0-9]{1}(\ |-){0,1}[0-9]{3}$)/.test(
                order_details.customer_phone
            )
        ) {
            response.render("status.ejs", {
                status: "Invalid phone number",
                message: "Please enter a valid australian phone number",
            });
            return;
        }

        if (!/^\S{1,}@\S{1,}[.]\S{1,}$/.test(order_details.customer_email)) {
            response.render("status.ejs", {
                status: "Invalid email address",
                message: "Please enter a valid email address",
            });
            return;
        }

        createOrder(
            validator.escape(order_details.customer_first_name),
            validator.escape(order_details.customer_last_name),
            validator.escape(order_details.customer_address),
            validator.escape(order_details.customer_email),
            validator.escape(order_details.customer_phone),
            validator.escape(order_details.product_id)
        ).then(([result]) => {
            createOrderLines(
                result.insertId,
                order_details.product_id,
                order_details.product_quantity
            ) 
            response.redirect("/order_confirmation?id=" + result.insertId);
        });
    } else {
        response.render("status.ejs", { status: "Error creating order. Please try again." });
    }
});


// .catch((error) => {
//     response.status(500).render("status.ejs", {
//         status: "Create order error",
//         message: "Failed to create order",
//     });
// });


// if (err) return response.status(500)


// if (!err) {
//     response.redirect("/order_confirmation?id=" + result.insertId);
// } else {
//     console.log(err)
// }


orderController.get("/order_confirmation", (request, response) => {
    const order_id = request.query.id;
    if (order_id) {
        getOrderWithProductByOrderId(order_id).then(([orders_with_products]) => {
            if (orders_with_products.length > 0) {
                const order_with_product = orders_with_products[0]
                response.status(200).render("order_confirmation.ejs", { order_with_product: order_with_product, });
            }
        });
    }
});


orderController.get("/order_admin", access_control(["manager", "sales"]), (request, response) => {
    let order_status = request.query.status;

    if (!order_status) {
        order_status = "pending";
    }

    getAllOrdersByStatusWithProduct(order_status).then(([orders]) => {
        response.status(200).render("order_admin.ejs", {
            orders: orders,
            order_status: order_status,
            user_role: request.session.user.user_role,
        });
    });

}
);

orderController.post("/order_admin", access_control(["manager", "sales"]), (request, response) => {
    const edit_details = request.body;
    updateOrderStatusById(edit_details.order_id, edit_details.status).then(([result]) => {
        if (result.affectedRows > 0) {
            response.redirect("/order_admin")
        } else {
            response.status(500).render("status.ejs", {
                status: "Failed to update order status",
                message: "No records updated",
            });
        }
    })

        .catch((error) => {
            response.status(500).render("status.ejs", {
                status: "Query error",
                message: "Failed to execute update query",
            });
        });
});


export default orderController;