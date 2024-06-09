// controllers/userController.js

import User from '../models/User.js';
import bcrypt from 'bcryptjs';

// Create a new user
export const createUser = async (req, res) => {
  try {
    const { username, password, isAdmin } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new User({ username, password: hashedPassword, isAdmin });
    await newUser.save();

    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Edit an existing user
export const editUser = async (req, res) => {
  try {
    const { username, password, isAdmin } = req.body;
    const updates = { username, isAdmin };

    // Hash the new password if it is provided
    if (password) {
      updates.password = await bcrypt.hash(password, 12);
    }

    console.log(`Updating user with ID: ${req.params.id}`); // Log user ID
    console.log('Updates:', updates); // Log updates

    const updatedUser = await User.findByIdAndUpdate(req.params.id, updates, { new: true });
    
    if (updatedUser) {
      res.status(200).json(updatedUser);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error updating user:', error); // More detailed logging
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Delete a user
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (user) {
      res.status(200).json({ message: 'User deleted successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a list of users
export const getUsers = async (req, res) => {
  try {
    const search = req.query.search ? { username: new RegExp(req.query.search, 'i') } : {};
    const users = await User.find(search);
    res.status(200).json({ users });
  } catch (error) {
    console.error('Error fetching users:', error.message);
    res.status(500).json({ message: error.message });
  }
};

// Get a specific user by ID
export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching user:', error.message);
    res.status(500).json({ message: error.message });
  }
};
