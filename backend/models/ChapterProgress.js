const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Chapter = require('./Chapter');
const Course = require('./Course');

const ChapterProgress = sequelize.define('ChapterProgress', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  chapter_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Chapter,
      key: 'id'
    }
  },
  course_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Course,
      key: 'id'
    }
  },
  is_completed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  progress: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: 'ChapterProgress',
  timestamps: true,
  createdAt: false, // We don't need created_at as per schema, or we can use it. Schema said updated_at only.
  updatedAt: 'updated_at'
});

// Associations
ChapterProgress.belongsTo(User, { foreignKey: 'user_id' });
ChapterProgress.belongsTo(Chapter, { foreignKey: 'chapter_id' });
ChapterProgress.belongsTo(Course, { foreignKey: 'course_id' });

User.hasMany(ChapterProgress, { foreignKey: 'user_id' });
Chapter.hasMany(ChapterProgress, { foreignKey: 'chapter_id' });

module.exports = ChapterProgress;
