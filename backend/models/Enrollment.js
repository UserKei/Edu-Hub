const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Course = require('./Course');
const Chapter = require('./Chapter');

const Enrollment = sequelize.define('Enrollment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  student_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
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
  grade: {
    type: DataTypes.FLOAT,
    comment: '考试成绩'
  },
  progress: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: '学习进度'
  },
  joined_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  last_chapter_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Chapter,
      key: 'id'
    },
    comment: '最后访问的章节ID'
  },
  last_accessed_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    comment: '最后访问时间'
  }
}, {
  tableName: 'Enrollment',
  timestamps: false
});

// Define associations
Enrollment.belongsTo(User, { foreignKey: 'student_id', as: 'student' });
Enrollment.belongsTo(Course, { foreignKey: 'course_id', as: 'course' });
Enrollment.belongsTo(Chapter, { foreignKey: 'last_chapter_id', as: 'last_chapter' });

// Also define the reverse associations if needed, but usually defining here is enough for Enrollment queries.
// However, to make sure Sequelize knows about the relationship from the other side if we ever use it:
User.hasMany(Enrollment, { foreignKey: 'student_id' });
Course.hasMany(Enrollment, { foreignKey: 'course_id' });

module.exports = Enrollment;
