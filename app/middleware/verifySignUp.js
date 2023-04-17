const db = require("../models");
const ROLES = db.ROLES;
const User = db.user;

checkDuplicateUsernameOrEmail = (req, res, next) => {
    // Email
    try {
        User.findOne({
            email: req.body.email
        }).then((user, err) => {

            if (err) {
                res.status(500).send({ message: err });
                return;
            }

            if (user) {
                res.status(400).send({ message: "Failed! Email is already in use!" });
                return;
            }

            next();
        });
    } catch (err) {
        res.status(500).send({ message: err });
        return;
    }

};

checkRolesExisted = (req, res, next) => {
    try {
        if (req.body.roles) {
            req.body.roles.map((role) => {
                if (ROLES && !ROLES.includes(role)) {
                    res.status(400).send({
                        message: `Failed! Role ${req.body.roles[i]} does not exist!`
                    });
                    return;
                }
            })
        }
        next();
    } catch (err) {
        res.status(500).send({ message: err });
        return;
    }
};

const verifySignUp = {
    checkDuplicateUsernameOrEmail,
    checkRolesExisted
};

module.exports = verifySignUp;