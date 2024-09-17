const { DataTypes } = require('sequelize');
const sequelize = require('./db');
const User = require('./User');

const Chat = sequelize.define('Chat', {
  userId1: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  userId2: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
});

module.exports = Chat;
