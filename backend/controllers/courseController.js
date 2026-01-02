const Course = require('../models/Course');
const Chapter = require('../models/Chapter');
const Enrollment = require('../models/Enrollment');

exports.createCourse = async (req, res) => {
  try {
    const { title, description, cover_image, type, access_code, teacher_id } = req.body;

    // 简单验证
    if (!title) {
      return res.status(400).json({ message: '课程标题不能为空' });
    }
    if (!teacher_id) {
      return res.status(400).json({ message: '教师ID不能为空' });
    }

    const newCourse = await Course.create({
      title,
      description,
      cover_image,
      type,
      access_code,
      teacher_id,
      status: 'DRAFT' // 默认为草稿
    });

    res.status(201).json({
      message: '课程创建成功',
      course: newCourse
    });
  } catch (error) {
    console.error('Create course error:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
};

exports.updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, cover_image, type, access_code } = req.body;

    const course = await Course.findByPk(id);
    if (!course) {
      return res.status(404).json({ message: '课程不存在' });
    }

    // 更新字段
    if (title !== undefined) course.title = title;
    if (description !== undefined) course.description = description;
    if (cover_image !== undefined) course.cover_image = cover_image;
    if (type !== undefined) course.type = type;
    if (access_code !== undefined) course.access_code = access_code;

    await course.save();

    res.json({ message: '课程更新成功', course });
  } catch (error) {
    console.error('Update course error:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
};

exports.publishCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await Course.findByPk(id);

    if (!course) {
      return res.status(404).json({ message: '课程不存在' });
    }

    // 完整性检查：至少需要有一个章节
    const chapterCount = await Chapter.count({ where: { course_id: id } });
    if (chapterCount === 0) {
      return res.status(400).json({ message: '无法发布：课程至少需要包含一个章节' });
    }

    course.status = 'PUBLISHED';
    await course.save();

    res.json({ message: '课程发布成功', course });
  } catch (error) {
    console.error('Publish course error:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
};

exports.getCourseList = async (req, res) => {
  try {
    // 这里可以添加分页、筛选等逻辑
    const courses = await Course.findAll({
      where: { status: 'PUBLISHED' } // 默认只返回已发布的课程
    });
    res.json(courses);
  } catch (error) {
    console.error('Get course list error:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
};

exports.getCourseDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await Course.findByPk(id);

    if (!course) {
      return res.status(404).json({ message: '课程不存在' });
    }

    res.json(course);
  } catch (error) {
    console.error('Get course detail error:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
};

// 获取当前用户已选修的课程列表
exports.getEnrolledCourses = async (req, res) => {
  try {
    const userId = req.user.id;
    const enrollments = await Enrollment.findAll({
      where: { student_id: userId },
      include: [{
        model: Course,
        as: 'course'
      }],
      order: [['joined_at', 'DESC']]
    });

    res.json(enrollments);
  } catch (error) {
    console.error('Get enrolled courses error:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
};

// 学生选课
exports.enrollCourse = async (req, res) => {
  try {
    const { id } = req.params; // course_id
    const { access_code } = req.body;
    const userId = req.user.id;

    const course = await Course.findByPk(id);
    if (!course) {
      return res.status(404).json({ message: '课程不存在' });
    }

    if (course.status !== 'PUBLISHED') {
      return res.status(403).json({ message: '课程未发布或已下架' });
    }

    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({
      where: {
        student_id: userId,
        course_id: id
      }
    });

    if (existingEnrollment) {
      return res.status(200).json({ message: '已选修该课程', enrollment: existingEnrollment });
    }

    // Check access code for PRIVATE courses
    if (course.type === 'PRIVATE') {
      if (course.access_code !== access_code) {
        return res.status(403).json({ message: '课程邀请码错误' });
      }
    }

    const newEnrollment = await Enrollment.create({
      student_id: userId,
      course_id: id
    });

    res.status(201).json({ message: '选课成功', enrollment: newEnrollment });
  } catch (error) {
    console.error('Enroll course error:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
};

// 获取课程内容 (章节树) - 需检查选课状态
exports.getCourseContent = async (req, res) => {
  try {
    const { id } = req.params; // course_id
    const userId = req.user.id;

    // Fetch course details first
    const course = await Course.findByPk(id);
    if (!course) {
      return res.status(404).json({ message: '课程不存在' });
    }

    // Check enrollment
    let enrollment = await Enrollment.findOne({
      where: {
        student_id: userId,
        course_id: id
      }
    });

    if (!enrollment) {
      // Check if user is the teacher
      if (course.teacher_id === userId) {
        enrollment = await Enrollment.create({
          student_id: userId,
          course_id: id,
          enrolled_at: new Date(),
          progress: 0,
          status: 'IN_PROGRESS'
        });
      }
      // Check if course is public and auto-enroll
      else if (course.type === 'PUBLIC') {
        enrollment = await Enrollment.create({
          student_id: userId,
          course_id: id,
          enrolled_at: new Date(),
          progress: 0,
          status: 'IN_PROGRESS'
        });
      } else {
        return res.status(403).json({ message: '请先加入课程后再进行学习' });
      }
    }

    // Fetch chapters
    const chapters = await Chapter.findAll({
      where: { course_id: id },
      order: [['order', 'ASC']],
      raw: true
    });

    // Build tree
    const buildTree = (items, parentId = null) => {
      return items
        .filter(item => item.parent_id === parentId)
        .map(item => {
          const children = buildTree(items, item.id);
          let type = 'FILE';
          if (children.length > 0) type = 'FOLDER';
          
          return {
            ...item,
            type,
            children
          };
        });
    };

    const tree = buildTree(chapters);
    res.json({ course, enrollment, chapters: tree });

  } catch (error) {
    console.error('Get course content error:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
};

