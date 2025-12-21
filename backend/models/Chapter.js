const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Chapter = sequelize.define('Chapter', {
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
    comment: '图文内容'
  },
  video_url: {
    type: DataTypes.STRING,
    comment: '视频地址'
  },
  resource_url: {
    type: DataTypes.STRING,
    comment: '课件/资料链接'
  },
  resource_name: {
    type: DataTypes.STRING,
    comment: '课件文件名'
  },
  order: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  course_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  parent_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  tableName: 'Chapter',
  timestamps: false // No created_at/updated_at in schema for Chapter
});

// Define associations
Chapter.hasMany(Chapter, { as: 'children', foreignKey: 'parent_id' });
Chapter.belongsTo(Chapter, { as: 'parent', foreignKey: 'parent_id' });

module.exports = Chapter;
