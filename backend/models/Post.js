const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Course = require('./Course');
const Chapter = require('./Chapter');

const Post = sequelize.define('Post', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  published: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  author_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  course_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Course,
      key: 'id'
    }
  },
  chapter_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Chapter,
      key: 'id'
    }
  }
}, {
  tableName: 'Post',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Define associations
Post.belongsTo(User, { foreignKey: 'author_id', as: 'author' });
Post.belongsTo(Course, { foreignKey: 'course_id', as: 'course' });
Post.belongsTo(Chapter, { foreignKey: 'chapter_id', as: 'chapter' });

module.exports = Post;
