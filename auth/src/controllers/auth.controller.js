const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require("../models/user.model");
const User_DB = [];

exports.register = (req, res) => {
    var newUser = new User(req.body.username, req.body.email, bcrypt.hashSync(req.body.password, 10));
    User_DB.push(newUser);
    return res.status(201).json({
        "msg": "New User created !"
    });
};

exports.login = (req, res) => {
    const { email, password } = req.body;
    const user = User_DB.find((u) => u.email === email && bcrypt.compareSync(password, u.password));
    if (user) {
        const accessToken = jwt.sign(
            { email: user.email }, // pas d'exp dans le payload
            process.env.ACCESS_JWT_KEY,
            { expiresIn: 120 } // 2 minutes
        );
        const refreshToken = jwt.sign(
            { email: user.email, exp: Math.floor(Date.now() / 1000) + 2 * 24 * 60 * 60 }, // 2 jours
            process.env.REFRESH_JWT_KEY
        );
        // Envoie le token dans un cookie HTTPOnly pour 2 jours
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            sameSite: 'strict',
            maxAge: 2 * 24 * 60 * 60 * 1000 // 2 jours
        });
        return res.status(200).json({ message: "You are now connected !", accessToken: accessToken });
    } else {
        return res.status(401).json({ message: "Invalid credentials" });
    }
};

exports.authenticate = (req, res) => {
    let bearer = req.headers["authorization"];
    let token;

    if (bearer && bearer.split(" ")[0] === "Bearer") {
        token = bearer.split(" ")[1];
    } else if (req.cookies && req.cookies.accessToken) {
        token = req.cookies.accessToken;
    }

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    jwt.verify(token, process.env.ACCESS_JWT_KEY, (err, decoded) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ message: "Token expired" });
            }
            return res.sendStatus(401);
        }
        const user = User_DB.find(u => u.email === decoded.email);
        if (!user) return res.sendStatus(401);
        return res.sendStatus(200);
    });
};

exports.refresh = (req, res) => {
    let refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return res.status(401).json({ message: "Unauthorized" });
    } else {
        jwt.verify(refreshToken, process.env.REFRESH_JWT_KEY, (err, decoded) => {
            if (err) return res.sendStatus(401);
            const user = User_DB.find(u => u.email === decoded.email);
            if (!user) return res.sendStatus(401);

            const accessToken = jwt.sign(
                { email: user.email },
                process.env.ACCESS_JWT_KEY,
                { expiresIn: 120 } // 2 minutes
            );
            const newRefreshToken = jwt.sign(
                { email: user.email, exp: Math.floor(Date.now() / 1000) + 2 * 24 * 60 * 60 },
                process.env.REFRESH_JWT_KEY
            );
            // Envoie le token dans un cookie HTTPOnly pour 2 jours
            res.cookie('refreshToken', newRefreshToken, {
                httpOnly: true,
                sameSite: 'strict',
                maxAge: 2 * 24 * 60 * 60 * 1000 // 2 jours
            });
            return res.status(200).json({ accessToken: accessToken });
        });
    }
}