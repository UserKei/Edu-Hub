const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const Chapter = require('../models/Chapter');
const User = require('../models/User');

exports.getContinueLearning = async (req, res) => {
  try {
    const userId = req.user.id; // From auth middleware

    const enrollments = await Enrollment.findAll({
      where: { student_id: userId },
      order: [['last_accessed_at', 'DESC']],
      limit: 5, // Limit to top 5 recent courses
      include: [
        {
          model: Course,
          as: 'course',
          attributes: ['id', 'title', 'cover_image', 'description'],
          include: [
            {
              model: User,
              as: 'teacher',
              attributes: ['id', 'nickname', 'avatar']
            }
          ]
        },
        {
          model: Chapter,
          as: 'last_chapter',
          attributes: ['id', 'title']
        }
      ]
    });

    // Format the response
    const data = enrollments.map(enrollment => ({
      course: enrollment.course,
      last_chapter: enrollment.last_chapter,
      progress: enrollment.progress,
      last_accessed_at: enrollment.last_accessed_at
    }));

    res.status(200).json({
      message: '获取最近学习记录成功',
      data: data
    });
  } catch (error) {
    console.error('Get continue learning error:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
};
