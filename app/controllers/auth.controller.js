const config = require("../config");
const db = require("../models");
const User = db.user;
const Role = db.role;

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8),
    });

    try {
        user.save()
            .then((user, err) => {

                if (err) {
                    res.status(500).send({ message: "User update error!" });
                    return;
                }

                if (req.body.roles) {
                    Role.find({
                        name: { $in: req.body.roles },
                    }).then((roles, err) => {
                        if (err) {
                            res.status(500).send({ message: "Not found role!" });
                            return;
                        }

                        user.roles = roles.map((role) => role.name);
                        user.save().then((user) => {
                            if (!user) {
                                res.status(500).send({ message: "Role update error!" });
                                return;
                            }
                            res.status(200).send({ message: "User was registered successfully!" });
                        });
                    }
                    );
                } else {
                    Role.findOne({ name: "user" }).then((role, err) => {
                        if (err) {
                            res.status(500).send({ message: "Not found role!" });
                            return;
                        }

                        user.roles = [role._id];
                        user.save().then((err) => {
                            if (err) {
                                res.status(500).send({ message: "Update role error!" });
                                return;
                            }

                            res.status(200).send({ message: "User was registered successfully!" });
                        });
                    });
                }
            });
    } catch (err) {
        res.status(500).send({ message: err });
    }

};

exports.signin = (req, res) => {
    try {
        User.findOne({
            //username: req.body.username,
            email: req.body.email
        }).then((user, err) => {

            if (err) {
                res.status(500).send({ message: err });
                return;
            }

            if (!user) {
                return res.status(404).send({ message: "User Not found." });
            }

            const passwordIsValid = bcrypt.compareSync(
                req.body.password,
                user.password
            );

            if (!passwordIsValid) {
                return res.status(401).send({ message: "Invalid Password!" });
            }

            const token = jwt.sign({ email: user.email }, config.secret, {
                expiresIn: 86400, // 24 hours
            });

            req.session.token = token;

            res.status(200).send({
                id: user._id,
                username: user.username,
                email: user.email,
                roles: user.roles,
            });
        })
    } catch (err) {
        res.status(500).send({ message: err });
    }

};

exports.signout = async (req, res) => {
    try {
        req.session = null;
        return res.status(200).send({ message: "You've been signed out!" });
    } catch (err) {
        this.next(err);
    }
};