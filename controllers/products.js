import express from "express";
import access_control from "../access_control.js";
import validator from "validator";
import { createChangeProduct } from "../models/changelog.js"
import { createProduct, getProductsBySearch, getProductById, getAllProducts, getAllProductsWithFeaturesById, getAllProductsWithFeatures, updateProductById, deleteProductById, deleteFeaturesById, createFeatures, updateFeaturesById } from "../models/products.js";


const productController = express.Router();

productController.get("/product_list", (request, response) => {
    if (request.query.search_term) {
        getProductsBySearch(request.query.search_term).then(([products]) => {
            response.status(200).render("product_list.ejs", { products: products });
        });
    } else {
        getAllProductsWithFeatures().then(([products]) => {
            response.status(200).render("product_list.ejs", { products: products });
        });                                                //From view: From database
    }
});


productController.get("/product_checkout", (request, response) => {
    if (request.query.id) {
        getProductById(request.query.id).then(([products]) => {
            if (products.length > 0) {
                const product = products[0];
                response.status(200).render("product_checkout.ejs", { product: product });
            }
        });
    }
});



productController.get("/product_admin", access_control(["manager", "stock"]), (request, response) => {
    const edit_id = request.query.edit_id;
    if (edit_id) {
        getAllProductsWithFeaturesById(edit_id).then(([products]) => {
            if (products.length > 0) {
                const edit_product = products[0];

                getAllProducts().then(([products]) => {
                    response.render("product_admin.ejs", {
                        products: products,
                        edit_product: edit_product,
                        user_role: request.session.user.user_role,
                    });
                });
            }
        });
    } else {
        getAllProducts().then(([products]) => {
            response.status(200).render("product_admin.ejs", {
                products: products,
                edit_product: {
                    product_id: 0,
                    product_name: "",
                    product_stock: 0,
                    product_price: 0,
                    product_features: "",
                },
                user_role: request.session.user.user_role,
            });
        });
    }
}
);







productController.post("/edit_product", access_control(["manager", "stock"]), (request, response) => {
    const edit_details = request.body;


    if (!/[0-9]{1,}/.test(edit_details.feature_weight_g)) {
        response.render("status.ejs", {
            status: "Invalid weight",
            message: "Must be at least one number",
        });
        return;
    }

    if (!/[0-9]{2,}/.test(edit_details.feature_height_mm)) {
        response.render("status.ejs", {
            status: "Invalid height",
            message: "Must be at least 2 numbers",
        });
        return;
    }

    if (!/[0-9]{2,}/.test(edit_details.feature_width_mm)) {
        response.render("status.ejs", {
            status: "Invalid width",
            message: "Must be at least 2 numbers",
        });
        return;
    }

    if (!/[0-9]{2,}/.test(edit_details.feature_depth_mm)) {
        response.render("status.ejs", {
            status: "Invalid depth",
            message: "Must be at least 2 numbers",
        });
        return;
    }

    if (!/[a-zA-Z0-9- ]{2,}/.test(edit_details.feature_operating_system)) {
        response.render("status.ejs", {
            status: "Invalid operating system",
            message: "Must be at least 2 letters and/or numbers",
        });
        return;
    }

    if (!/[0-9.]{2,}/.test(edit_details.feature_screen_size)) {
        response.render("status.ejs", {
            status: "Invalid screen size",
            message: "Must be at least 2 numbers",
        });
        return;
    }


    if (!/[0-9]{3,}[x]{1}[0-9]{3,}/.test(edit_details.feature_screen_resolution)) {
        response.render("status.ejs", {
            status: "Invalid screen resolution",
            message: "Must be at least 3 numbers followed by an 'x' followed by at least another 3 numbers",
        });
        return;
    }

    if (!/[a-zA-Z0-9 ]{2,}/.test(edit_details.feature_cpu)) {
        response.render("status.ejs", {
            status: "Invalid cpu input",
            message: "Must be at least 2 letters and/or numbers",
        });
        return;
    }

    if (!/[0-9]{1,2}[gb]/i.test(edit_details.feature_ram)) {
        response.render("status.ejs", {
            status: "Invalid ram input",
            message: "Must be 1-2 numbers followed by gb",
        });
        return;
    }

    if (!/[0-9]{2,3}[gb]/i.test(edit_details.feature_storage)) {
        response.render("status.ejs", {
            status: "Invalid storage input",
            message: "Must be 2-3 numbers followed by gb",
        });
        return;
    }

    if (!/[0-9]{4}[mah]/i.test(edit_details.feature_battery)) {
        response.render("status.ejs", {
            status: "Invalid battery input",
            message: "Must be at least 4 numbers followed by mah",
        });
        return;
    }

    if (!/[0-9]{2}[mp]/i.test(edit_details.feature_rear_camera)) {
        response.render("status.ejs", {
            status: "Invalid rear camera input",
            message: "Must be at least 2 numbers followed by mp",
        });
        return;
    }

    if (!/[0-9]{2}[mp]/i.test(edit_details.feature_front_camera)) {
        response.render("status.ejs", {
            status: "Invalid front camera input",
            message: "Must be at least 2 numbers followed by mp",
        });
        return;
    }

    if (!/[0-9]{1,}/.test(edit_details.product_id)) {
        response.render("status.ejs", {
            status: "Invalid product ID",
            message: "Something went wrong.",
        });
        return;
    }

    if (!/[a-zA-Z0-9 ]{1,}/.test(edit_details.product_name)) {
        response.render("status.ejs", {
            status: "Invalid product name",
            message: "Must be at least 1 letter and/or number",
        });
        return;
    }

    if (!/[a-zA-Z0-9 ]{1,}/.test(edit_details.product_model)) {
        response.render("status.ejs", {
            status: "Invalid product model",
            message: "Must be at least 1 letter and/or number",
        });
        return;
    }

    if (!/[a-zA-Z0-9 ]{1,}/.test(edit_details.product_manufacturer)) {
        response.render("status.ejs", {
            status: "Invalid manufacturer input",
            message: "Must be at least 1 letter and/or number",
        });
        return;
    }

    if (!/[0-9]{4}/.test(edit_details.product_price)) {
        response.render("status.ejs", {
            status: "Invalid price",
            message: "Must be at least 4 numbers",
        });
        return;
    }

    if (!/[0-9]{1,}/.test(edit_details.product_stock)) {
        response.render("status.ejs", {
            status: "Invalid stock",
            message: "Must be at least 1 number",
        });
        return;
    }



    if (edit_details.action == "create") {
        createFeatures(
            validator.escape(edit_details.feature_weight_g),
            validator.escape(edit_details.feature_height_mm),
            validator.escape(edit_details.feature_width_mm),
            validator.escape(edit_details.feature_depth_mm),
            validator.escape(edit_details.feature_operating_system),
            validator.escape(edit_details.feature_screen_size),
            validator.escape(edit_details.feature_screen_resolution),
            validator.escape(edit_details.feature_cpu),
            validator.escape(edit_details.feature_ram),
            validator.escape(edit_details.feature_storage),
            validator.escape(edit_details.feature_battery),
            validator.escape(edit_details.feature_rear_camera),
            validator.escape(edit_details.feature_front_camera)
        ).then(([results]) => {
            const createdFeature = results.insertId
            createProduct(
                validator.escape(edit_details.product_id),
                validator.escape(edit_details.product_name),
                validator.escape(edit_details.product_model),
                validator.escape(edit_details.product_manufacturer),
                validator.escape(edit_details.product_price),
                validator.escape(edit_details.product_stock),
                createdFeature
            ).then(([results]) => {
                edit_details.product_id = results.insertId
                createChangeProduct(request.session.user.user_id, `User with user id: ${request.session.user.user_id} created product with product id: ${edit_details.product_id}`, edit_details.product_id);
                response.redirect("/product_admin");
            });
        });
    } else if (edit_details.action == "update") {
        updateFeaturesById(
            validator.escape(edit_details.feature_id),
            validator.escape(edit_details.feature_weight_g),
            validator.escape(edit_details.feature_height_mm),
            validator.escape(edit_details.feature_width_mm),
            validator.escape(edit_details.feature_depth_mm),
            validator.escape(edit_details.feature_operating_system),
            validator.escape(edit_details.feature_screen_size),
            validator.escape(edit_details.feature_screen_resolution),
            validator.escape(edit_details.feature_cpu),
            validator.escape(edit_details.feature_ram),
            validator.escape(edit_details.feature_storage),
            validator.escape(edit_details.feature_battery),
            validator.escape(edit_details.feature_rear_camera),
            validator.escape(edit_details.feature_front_camera),
        ).then(([results]) => {
            updateProductById(
                validator.escape(edit_details.product_id),
                validator.escape(edit_details.product_name),
                validator.escape(edit_details.product_model),
                validator.escape(edit_details.product_manufacturer),
                validator.escape(edit_details.product_price),
                validator.escape(edit_details.product_stock),
            ).then(([results]) => {
                createChangeProduct(request.session.user.user_id, `User with user id: ${request.session.user.user_id} updated product with product id: ${edit_details.product_id}`, edit_details.product_id);
                response.redirect("/product_admin");
            });
        });
    } else if (edit_details.action == "delete") {
        createChangeProduct(request.session.user.user_id, `User with user id: ${request.session.user.user_id} deleted product with product id: ${edit_details.product_id}`, edit_details.product_id);

        deleteFeaturesById(edit_details.feature_id).then(([result]) => {
            deleteProductById(edit_details.product_id).then(([result]) => {

                response.redirect("/product_admin")
                ;
            }).catch((error) => {
                response.status(400).render("status.ejs", {
                    status: "Query error",
                    message: "Failed to execute delete query",
                });
            }
            );
        })
           
    }
});














export default productController;