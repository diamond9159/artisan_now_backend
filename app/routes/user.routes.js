const { authJwt } = require("../middleware");
const controller = require("../controllers/user.controller");

module.exports = function (app) {


    app.get("/api/test/all", controller.allAccess);

    app.get("/api/test/user", [authJwt.verifyToken], controller.userBoard);

    app.get(
        "/api/test/artisan",
        [authJwt.verifyToken, authJwt.isArtisan],
        controller.artisanBoard
    );

    app.get(
        "/api/test/admin",
        [authJwt.verifyToken, authJwt.isAdmin],
        controller.adminBoard
    );
};