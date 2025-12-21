const Course = require('../models/Course');
const Chapter = require('../models/Chapter');

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
