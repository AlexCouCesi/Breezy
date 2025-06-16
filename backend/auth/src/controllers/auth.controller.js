import { validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import {User} from '../models/user.model.js';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: +process.env.SMTP_PORT,
    auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
    }
});

const register = async (req, res, next) => {
  // 1. Validation des champs
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;

    try {
    // 2. Vérifier l’unicité
    if (await User.findOne({ email })) {
        return res.status(409).json({ message: 'Email déjà utilisé' });
    }

    // 3. Hash du mot de passe
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // 4. Générer un token de vérification
    const verificationToken = crypto.randomBytes(32).toString('hex');

    // 5. Créer l’utilisateur
    const user = await User.create({
        username,
        email,
        passwordHash,
        verificationToken
    });

    // 6. Envoyer l’email de confirmation
    const confirmUrl = `${process.env.CLIENT_URL}/auth/verify/${verificationToken}`;
    await transporter.sendMail({
        from: `"Breezy" <${process.env.SMTP_USER}>`,
        to: email,
        subject: 'Vérifiez votre adresse email',
        html: `
        <h1>Bonjour ${username}</h1>
        <p>Cliquez <a href="${confirmUrl}">ici</a> pour confirmer votre adresse email.</p>
        `
    });

    res.status(201).json({ message: 'Inscription réussie, merci de confirmer votre email.' });
    } catch (err) {
    next(err);
    }
};

const verifyEmail = async (req, res, next) => {
    const { token } = req.params;
    try {
    const user = await User.findOne({ verificationToken: token });
    if (!user) {
        return res.status(400).json({ message: 'Token invalide ou expiré' });
    }
    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();
    res.json({ message: 'Email vérifié, vous pouvez vous connecter.' });
    } catch (err) {
    next(err);
    }
};

const login = async (req, res, next) => {
    const { email, password } = req.body;
    try {
    // 1. Trouver l’utilisateur
    const user = await User.findOne({ email });
    if (!user || !await user.comparePassword(password)) {
        return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }
    // 2. Vérifier l’email
    if (!user.isVerified) {
        return res.status(403).json({ message: 'Veuillez vérifier votre adresse email' });
    }
    // 3. Générer un JWT
    const payload = { sub: user._id, role: user.role || 'USER' };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({ token, user: { id: user._id, username: user.username, email: user.email } });
    } catch (err) {
    next(err);
    }
};

export { register, verifyEmail, login };
