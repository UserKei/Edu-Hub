const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Course = sequelize.define('Course', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  cover_image: {
    type: DataTypes.STRING
  },
  type: {
    type: DataTypes.ENUM('PUBLIC', 'PRIVATE'),
    defaultValue: 'PUBLIC',
    comment: '课程类型'
  },
  access_code: {
    type: DataTypes.STRING,
    comment: '私有课程必填，相当于入场券密码'
  },
  status: {
    type: DataTypes.ENUM('DRAFT', 'PUBLISHED', 'OFFLINE', 'ARCHIVED', 'BANNED'),
    defaultValue: 'DRAFT',
    comment: '课程状态'
  },
  ban_reason: {
    type: DataTypes.STRING,
    comment: '仅在 status=BANNED 时有值'
  },
  teacher_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'Course',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Course;
