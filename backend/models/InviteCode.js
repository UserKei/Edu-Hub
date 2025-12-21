const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const InviteCode = sequelize.define('InviteCode', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  code: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    comment: '仅用于注册教师账号的邀请码'
  },
  is_used: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'InviteCode',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false // No updated_at column in the schema for InviteCode
});

module.exports = InviteCode;
