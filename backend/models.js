const { DataTypes } = require('sequelize');
const sequelize = require('./models/db');

const Chat = sequelize.define('Chat', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  }
});

const Message = sequelize.define('Message', {
  chatId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  content: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  is_from_admin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

Chat.hasMany(Message, { foreignKey: 'chatId' });
Message.belongsTo(Chat, { foreignKey: 'chatId' });

sequelize.sync()
  .then(() => console.log('Tables created successfully!'))
  .catch(err => console.log('Error: ' + err));

module.exports = { Chat, Message };
