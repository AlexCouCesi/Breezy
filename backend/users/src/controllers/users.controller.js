import User from '../models/user.model.js';
import mongoose from 'mongoose';

// Créer une nouvelle utilisateur
export const createUser = async (req, res) => {
    const { username, email, _id } = req.body;
    try {
        const newUser = new User({ username, email, _id });
        await newUser.save();
        res.status(201).json({ message: "User created successfully", user: newUser });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Récupérer toutes les utilisateurs
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Récupérer une utilisateur par ID
export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Mettre à jour une utilisateur
export const updateUser = async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedUser) return res.status(404).json({ error: 'User not found' });
        res.status(200).json(updatedUser);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Supprimer une utilisateur
export const deleteUser = async (req, res) => {
    try {
        const deleted = await User.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ error: 'User not found' });
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

//todo : a implémenter
export const banUser = async (req, res) => {
    res.status(200).json({ message: `Utilisateur ${req.params.id} banni` });
}

export const followUser = async (req, res) => {
    const followedUserId = req.user.id;
    const followerUserId = req.params.id;
    if (!followedUserId) {
        return res.status(400).json({ error: 'User ID is required' });
    }
    try {
        const followerUser = await User.findById(followerUserId);
        const followedUser = await User.findById(followedUserId);
        if (!followerUser) return res.status(404).json({ error: 'User not found' });

        if (followedUser.followers.includes(followerUserId)) {
            return res.status(400).json({ error: 'You are already following this user' });
        } else {
            followedUser.followers.push(followerUserId);
            followerUser.following.push(followedUserId);
            await followerUser.save();
            await followedUser.save();
        }
        res.status(200).json({ message: `User ${followerUserId} followed user ${followedUserId}` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const unfollowUser = async (req, res) => {
    const followedUserId = req.user.id;
    const followerUserId = req.params.id;
    if (!followedUserId) {
        return res.status(400).json({ error: 'User ID is required' });
    }
    try {
        const followerUser = await User.findById(followerUserId);
        const followedUser = await User.findById(followedUserId);
        if (!followerUser) return res.status(404).json({ error: 'User not found' });

        if (!followedUser.followers.includes(followerUserId)) {
            return res.status(400).json({ error: 'You are not following this user' });
        } else {
            followedUser.followers.pull(followerUserId);
            followerUser.following.pull(followedUserId);
            await followerUser.save();
            await followedUser.save();
        }
        res.status(200).json({ message: `User ${followerUserId} unfollowed user ${followedUserId}` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}