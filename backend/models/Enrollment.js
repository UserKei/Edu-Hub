const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Course = require('./Course');

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
  }
}, {
  tableName: 'Enrollment',
  timestamps: false // Enrollment table in dbml doesn't have updated_at, only joined_at which is handled above
});

// Define associations
Enrollment.belongsTo(User, { foreignKey: 'student_id', as: 'student' });
Enrollment.belongsTo(Course, { foreignKey: 'course_id', as: 'course' });

// Also define the reverse associations if needed, but usually defining here is enough for Enrollment queries.
// However, to make sure Sequelize knows about the relationship from the other side if we ever use it:
User.hasMany(Enrollment, { foreignKey: 'student_id' });
Course.hasMany(Enrollment, { foreignKey: 'course_id' });

module.exports = Enrollment;
