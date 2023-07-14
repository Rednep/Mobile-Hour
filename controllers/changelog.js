import express from "express";
import access_control from "../access_control.js";
import { getAllChanges } from "../models/changelog.js";

const changelogController = express.Router()

changelogController.get("/users_changelog", access_control(["manager"]), (request, response) => {
    getAllChanges().then(([changes]) => {
        response.status(200).render("users_changelog.ejs", { changes: changes, user_role: request.session.user.user_role, });
    });
}
);





export default changelogController;