const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

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

// Define associations
// 注意：这里需要使用 require('./User') 来避免循环依赖问题，或者确保 User 模型已经定义
// 但由于 User 和 Course 互相引用，最好在模型定义之后，或者在一个单独的 associations 文件中定义关系
// 这里我们尝试直接定义，但要注意加载顺序。
// 为了安全起见，我们在使用时再关联，或者使用 sequelize.models.User

Course.belongsTo(User, { foreignKey: 'teacher_id', as: 'teacher' });

module.exports = Course;
