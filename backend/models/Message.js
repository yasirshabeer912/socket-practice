const { DataTypes } = require('sequelize');
const sequelize = require('./db');
const Chat = require('./Chat');

const Message = sequelize.define('Message', {
  chatId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Chat,
      key: 'id',
    },
  },
  senderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

module.exports = Message;
