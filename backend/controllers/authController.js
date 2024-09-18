const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { generateToken } = require('../config/jwtConfig');
const { Op } = require('sequelize');

const registerUser = async (req, res) => {
  const { username, password } = req.body;
  console.log(username, password)
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, password: hashedPassword });
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: 'User registration failed', message: error });
  }
};

const loginUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ where: { username } });
    if (user && await bcrypt.compare(password, user.password)) {
      const token = generateToken(user.id);
      res.json({ message: "Logged In Successfully", token });
    } else {
      res.status(400).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
};

const searchUsers = async (req, res) => {
  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ message: 'Username query parameter is required' });
  }

  try {
    // Search users in the database whose usernames match the search term
    const users = await User.findAll({
      where: {
        username: {
          [Op.like]: `%${username}%` // 'Op' comes from Sequelize and allows partial matching
        }
      }
    });

    // Return the found users
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while searching for users' });
  }
}

module.exports = { registerUser, loginUser, searchUsers };
