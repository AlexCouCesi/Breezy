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
      { email: user.email, exp: Math.floor(Date.now() / 1000) + 120 },
      process.env.ACCESS_JWT_KEY
    );
    // Envoie le token dans un cookie HTTPOnly
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 2 * 60 * 1000 // 2 minutes
    });
    return res.status(200).json({ message: "You are now connected !" });
  } else {
    return res.status(401).json({ message: "Invalid credentials" });
  }
};

exports.authenticate = (req, res) => {
    let bearer = req.headers["authorization"];
    if (!bearer) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    let token = bearer.split(" ")[1];
    if (bearer.split(" ")[0] !== "Bearer" || !token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
 
    jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
        // Vérification si l’utilisateur décodé existe
        const user = User_DB.find(u => u.username === decoded.username);
        // Renvoyer une réponse adaptée en fonction de son état
        if (err || !user) {
            return res.status(401).json({ message: "Unauthorized" });
        } else {
            return res.status(200).json({ message: "Authenticated" });
        }
    });
};