const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ============================================================
// PROMISE WRAPPER
// ============================================================

const query = (sql, values = []) => {
    return new Promise((resolve, reject) => {

        db.query(sql, values, (error, results) => {

            if (error) {
                reject(error);
            } else {
                resolve(results);
            }

        });

    });
};


// ============================================================
// SIGNUP
// ============================================================

const signup = async (req, res) => {

    try {

        const {
            username,
            email,
            phone_no,
            password
        } = req.body;


        // --------------------------------------------------------
        // VALIDATION
        // --------------------------------------------------------

        if (
            !username ||
            !email ||
            !phone_no ||
            !password
        ) {

            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });

        }


        if (password.length < 6) {

            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters"
            });

        }


        // --------------------------------------------------------
        // CHECK USERNAME
        // --------------------------------------------------------

        const existingUsername = await query(
            `
            SELECT staff_id
            FROM staff
            WHERE username = ?
            `,
            [username]
        );


        if (existingUsername.length > 0) {

            return res.status(409).json({
                success: false,
                message: "Username already exists"
            });

        }


        // --------------------------------------------------------
        // CHECK EMAIL
        // --------------------------------------------------------

        const existingEmail = await query(
            `
            SELECT staff_id
            FROM staff
            WHERE email = ?
            `,
            [email]
        );


        if (existingEmail.length > 0) {

            return res.status(409).json({
                success: false,
                message: "Email already exists"
            });

        }


        // --------------------------------------------------------
        // HASH PASSWORD
        // --------------------------------------------------------

        const hashedPassword =
            await bcrypt.hash(password, 10);


        // --------------------------------------------------------
        // INSERT USER
        // --------------------------------------------------------

        const result = await query(
            `
            INSERT INTO staff
            (
                username,
                password,
                phone_no,
                email,
                staff_role
            )
            VALUES (?, ?, ?, ?, ?)
            `,
            [
                username,
                hashedPassword,
                phone_no,
                email,
                "Staff"
            ]
        );


        // --------------------------------------------------------
        // RESPONSE
        // --------------------------------------------------------

        res.status(201).json({

            success: true,

            message: "Account created successfully",

            user: {
                staff_id: result.insertId,
                username: username,
                email: email,
                phone_no: phone_no,
                staff_role: "Staff"
            }

        });

    }

    catch (error) {

        console.error(
            "SIGNUP ERROR:",
            error
        );

        res.status(500).json({

            success: false,

            message: "Failed to create account",

            error: error.message

        });

    }

};


// ============================================================
// LOGIN
// ============================================================

const login = async (req, res) => {

    try {

        const {
            username,
            password
        } = req.body;


        // --------------------------------------------------------
        // VALIDATION
        // --------------------------------------------------------

        if (!username || !password) {

            return res.status(400).json({

                success: false,

                message:
                    "Username and password are required"

            });

        }


        // --------------------------------------------------------
        // FIND USER
        // --------------------------------------------------------

        const users = await query(
            `
            SELECT
                staff_id,
                username,
                password,
                phone_no,
                email,
                staff_role

            FROM staff

            WHERE username = ?
            `,
            [username]
        );


        if (users.length === 0) {

            return res.status(401).json({

                success: false,

                message:
                    "Invalid username or password"

            });

        }


        const user = users[0];


        // --------------------------------------------------------
        // CHECK PASSWORD
        // --------------------------------------------------------

        const passwordMatch =
            await bcrypt.compare(
                password,
                user.password
            );


        if (!passwordMatch) {

            return res.status(401).json({

                success: false,

                message:
                    "Invalid username or password"

            });

        }


        // --------------------------------------------------------
        // CREATE JWT
        // --------------------------------------------------------

        const token = jwt.sign(

            {
                staff_id: user.staff_id,
                username: user.username,
                staff_role: user.staff_role
            },

            process.env.JWT_SECRET,

            {
                expiresIn: "1d"
            }

        );


        // --------------------------------------------------------
        // REMOVE PASSWORD
        // --------------------------------------------------------

        delete user.password;


        // --------------------------------------------------------
        // RESPONSE
        // --------------------------------------------------------

        res.json({

            success: true,

            message: "Login successful",

            token: token,

            user: user

        });

    }

    catch (error) {

        console.error(
            "LOGIN ERROR:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                "Failed to login",

            error:
                error.message

        });

    }

};


// ============================================================
// GET CURRENT USER
// ============================================================

const getMe = async (req, res) => {

    try {

        const users = await query(
            `
            SELECT
                staff_id,
                username,
                phone_no,
                email,
                staff_role

            FROM staff

            WHERE staff_id = ?
            `,
            [req.user.staff_id]
        );


        if (users.length === 0) {

            return res.status(404).json({

                success: false,

                message: "User not found"

            });

        }


        res.json({

            success: true,

            user: users[0]

        });

    }

    catch (error) {

        console.error(
            "GET USER ERROR:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                "Failed to fetch user"

        });

    }

};


module.exports = {
    signup,
    login,
    getMe
};