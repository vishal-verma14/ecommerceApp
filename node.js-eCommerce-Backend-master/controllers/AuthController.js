const { body, validationResult } = require('express-validator')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user')
const formidable =  require("formidable");
const _ = require("lodash");
const { constants } = require('../constants');
const { getUserData } = require('../middlewares/user');

/**
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @description Handles signup of user
 */
exports.signup = (req, res) => {
    const errors = validationResult(req);
    const { email, password } = req.body;

    if (!errors.isEmpty()) {
        return res.status(400).json({
            error: errors.array()[0].msg
        })
    }

    User.findOne({ email: email }).then((user) => {
        if (user) {
            return res.status(400).json({
                error: 'E-mail is already registered'
            })
        }
        const newUser = new User(req.body);
        newUser.userType = constants.USER_TYPES.USER
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
                if (err) throw err;
                newUser.password = hash;
                newUser.save().then((user) => {
                    const { name, userType, email, _id } = user;
                    const payload = {
                        id: _id,
                        email: email,
                        userType: constants.USER_TYPES.USER,
                    }
                    const data = {
                        email: email,
                        id: _id,
                        userType: constants.USER_TYPES.USER,
                    }
                    jwt.sign(
                        payload,
                        process.env.SECRET,
                        { expiresIn: 3600 },
                        (err, token) => {
                            res.status(200).json({
                                token: "Bearer " + token,
                                data: data,
                                message: `Signup Successfull`
                            });
                            if (err) {
                                res.json({
                                    success: false,
                                    error: err,
                                });
                            }
                        }
                    );
                }).catch((err) => {
                    res.status(400).json(err)
                })
            })
        })
    })

}

/**
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @description Handles signin of user
 */
exports.signin = (req, res) => {
    const errors = validationResult(req);
    const { email, password } = req.body;

    if (!errors.isEmpty()) {
        return res.status(422).json({
            error: errors.array()[0].msg,
        })
    }

    User.findOne({ email: email }).then((user) => {
        if (!user) {
            return res.status(400).json({
                error: 'E-mail not found'
            })
        }

        bcrypt.compare(password, user.password).then((isCorrect) => {
            if (isCorrect) {
                const payload = {
                    id: user.id,
                    email: user.email,
                    userType: user.userType
                }
                console.log(payload)
                jwt.sign(
                    payload,
                    process.env.SECRET,
                    { expiresIn: 3600 },
                    (err, token) => {
                        const { name, userType, email, _id } = user;
                        res.json({
                            token: "Bearer " + token,
                            data: {
                                name: name,
                                userType: userType,
                                email: email,
                                id: _id,
                            },
                            message: `Signin Successfull`
                        });
                        if (err) {
                            res.json({
                                success: false,
                                error: err,
                            });
                        }
                    }
                );
            } else {
                res.status(400).json({
                    error: "Password doesn't match"
                })
            }
        }).catch((error) => {
            res.status(500).json({
                log: error,
                error: "Unknown Error",
            })
        });
    });
}

/**
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @description Handles sigout of user
 */
exports.signout = (req, res) => {
    res.clearCookie("token");
    res.json({
        status: true,
        message: "User signed-out successfully",
    });
}

/**
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @description updates data of user
 */
exports.updateUser = (req, res) => {
    const userId = req.params.userId; 
    const updateData = req.body; 

    const {email, password} = req.body;

    if(email || password) {
        return res.status(402).json({
            error: 'E-mail & Password change is restricted here'
        })
    }

    const updateObject = { $set: updateData };

    User.updateOne({ _id: userId }, updateObject)
        .then(result => {
            if (result) {
                res.status(200).json({ message: 'User updated successfully' });
            } else {
                res.status(404).json({ error: 'User not found' });
            }
        })
        .catch(err => {
            res.status(500).json({log: err, error: 'Internal server error' });
    });

}

/**
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @description retrives user data
 */
exports.getUser = async(req, res) => {
    try {
        const userId = req.params.userId;

        const user = await User.findById(userId)
            .select('-password -_id -createdAt -email -updatedAt -__v') // Exclude sensitive fields
            .lean(); 

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Remove _id from nested fields like address if it exists
        if (user.address && user.address._id) {
            delete user.address._id;
        }

        return res.status(200).json({ data: user });
    } catch (err) {
        return res.status(500).json({ log: err, error: 'Internal server error' });
    }
}