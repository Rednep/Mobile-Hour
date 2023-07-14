import express from "express";
import bcrypt from "bcryptjs";
import validator from "validator";
import { createChangeUser } from "../models/changelog.js";
import access_control from "../access_control.js";
import { getUserByUsername, createUser, getUserById, getAllUsers, updateUserById, deleteUserById } from "../models/users.js";

const usersController = express.Router();


usersController.get("/users_login", (request, response) => {
    response.status(200).render("users_login.ejs")
});

usersController.post("/users_login", (request, response) => {
    const login_username = request.body.username;
    const login_password = request.body.password;


    if (!/[a-zA-Z-]{2,}/.test(login_username)) {
        response.render("status.ejs", {
            status: "Invalid username",
            message: "Must be at least two letters or numbers",
        });
        return;
    }

    if (!/[a-zA-Z0-9-!@#$%^&*()]{6,}/.test(login_password)) {
        response.render("status.ejs", {
            status: "Invalid password",
            message: "Must be at least 6 letters, numbers or symbols",
        });
        return;
    }




    console.log(login_username);
    console.log(login_password);

    getUserByUsername(login_username).then(([user]) => {
        if (user.length > 0) {
            const users = user[0];
            if (bcrypt.compareSync(login_password, users.user_password)) {
                request.session.user = {
                    user_id: users.user_id,
                    user_role: users.user_role,
                };
                response.redirect("/order_admin");

            } else {
                response.render("status.ejs", { status: "Invalid password" });
            }
        } else {
            response.render("status.ejs", { status: "Invalid username" });
        }
    });
});

usersController.get("/user_logout", (request, response) => {
    request.session.destroy()
    response.redirect("/");
});


usersController.get("/users_admin", access_control(["manager"]), (request, response) => {
    const edit_id = request.query.edit_id
    if (edit_id) {
        getUserById(edit_id).then(([user]) => {
            if (user.length > 0) {
                const users = user[0]

                getAllUsers().then(([user]) => {
                    response.status(200).render("users_admin.ejs", {
                        user_role: request.session.user.user_role,
                        user: user,
                        edit_users: users,
                    });
                });
            }
        });
    } else {
        getAllUsers().then(([user]) => {
            response.status(200).render("users_admin.ejs", {
                user_role: request.session.user.user_role,
                user: user,
                edit_users: {
                    user_id: 0,
                    first_name: "",
                    last_name: "",
                    user_role: "",
                    username: "",
                    password: "",
                },
            });
        });
    }
});

usersController.post("/edit_users", access_control(["manager"]), (request, response) => {
    const edit_details = request.body;

    if (!/[a-zA-Z-]{2,}/.test(edit_details.first_name)) {
        response.render("status.ejs", {
            status: "Invalid first name",
            message: "First name must have at least 2 letters",
        });
        return;
    }

    if (!/[a-zA-Z-]{2,}/.test(edit_details.last_name)) {
        response.render("status.ejs", {
            status: "Invalid last name",
            message: "Last name must have at least 2 letters",
        });
        return;
    }

    if (!/[a-zA-Z0-9-]{6,}/.test(edit_details.password)) {
        response.render("status.ejs", {
            status: "Invalid password",
            message:
                "Password must be at least 6 characters long and contain a variety of characters.",
        });
        return;
    }

    if (edit_details.action == "create") {
        createUser(
            validator.escape(edit_details.first_name),
            validator.escape(edit_details.last_name),
            validator.escape(edit_details.user_role),
            validator.escape(edit_details.username),
            bcrypt.hashSync(edit_details.password)
        ).then(([result]) => {
            createChangeUser(request.session.user.user_id, `User with username ${edit_details.username} created`
            );
            response.redirect("/users_admin");
        });
    } else if (edit_details.action == "update") {
        if (!edit_details.password.startsWith("$2a")) {
            edit_details.password = bcrypt.hashSync(edit_details.password);
        }
        updateUserById(
            validator.escape(edit_details.user_id),
            validator.escape(edit_details.first_name),
            validator.escape(edit_details.last_name),
            validator.escape(edit_details.user_role),
            validator.escape(edit_details.username),
            validator.escape(edit_details.password),
        ).then(([result]) => {
            createChangeUser(request.session.user.user_id, `User with username ${edit_details.username} updated`
            );
            response.redirect("/users_admin");
        });

    } else if (edit_details.action == "delete") {
        createChangeUser(request.session.user.user_id, `User with username ${edit_details.username} deleted`
        );
        deleteUserById(edit_details.user_id).then(([result]) => {
            response.redirect("/users_admin");
        })
            .catch((error) => {
                response.status(500).render("status.ejs", {
                    status: "Query error",
                    message: "Failed to execute delete query",
                });
            }
            )
    }
});





// TO DELETE!!!
// usersController.get("/create_default_user", (request, response) => {
//     const user_role = "manager";
//     const first_name = "default";
//     const last_name = "user";
//     const username = "user";
//     const password = "abc123";
//     const hashed_password = bcrypt.hashSync(password);


//     createUser(first_name, last_name, user_role, username, hashed_password)
//     .then((query_result) => {
//         response.json({
//             message: "default user created",
//             username: username,
//             password: password,
//         });
//     });
// });

usersController.get("/whoami", (request, response) => {
    if (request.session.user) {
        response.json(request.session.user);
    } else {
        response.json("No session")
    }
});


// About us & Contact Page

usersController.get("/about", (request, response) => {
    response.status(200).render("about.ejs")
});

usersController.get("/contact", (request, response) => {
    response.status(200).render("contact.ejs")
});



export default usersController;
