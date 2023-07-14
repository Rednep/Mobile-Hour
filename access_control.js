export default function access_control(allowed_roles) {
    return function (request, response, next) {
        if (request.session.user != null) {
            if (allowed_roles.includes(request.session.user.user_role)) {
                next();

            } else {
                response.status(403).render("status.ejs", {
                    status: "Access Denied",
                    message: "Invalid access role",
                });
            }
        } else {
            response.status(401).render("status.ejs", {
                status: "Access Denied",
                message: "Not logged in",
            });
        }
    };
}