const Chapter = require('../models/Chapter');
const Enrollment = require('../models/Enrollment');

// 递归构建树形结构
const buildChapterTree = (chapters, parentId = null) => {
  return chapters
    .filter(chapter => chapter.parent_id === parentId)
    .map(chapter => {
      const children = buildChapterTree(chapters, chapter.id);
      
      // 判断节点类型：如果有子节点，或者没有内容字段，则视为 FOLDER
      // 这里简化逻辑：如果有子节点，强制为 FOLDER
      let type = 'FILE';
      if (children.length > 0) {
        type = 'FOLDER';
      }
      // 移除之前的逻辑：即使没有内容，只要没有子节点，也默认为 FILE，以便前端可以编辑内容
      // 如果用户想把它当目录用，直接添加子节点即可（添加子节点后会自动变为 FOLDER）

      return {
        id: chapter.id,
        title: chapter.title,
        type: type,
        content: chapter.content,
        video_url: chapter.video_url,
        resource_url: chapter.resource_url,
        resource_name: chapter.resource_name,
        order: chapter.order,
        children: children
      };
    });
};

exports.addChapter = async (req, res) => {
  try {
    const { course_id } = req.params;
    const { title, content, video_url, resource_url, resource_name, parent_id, order } = req.body;

    if (!title) {
      return res.status(400).json({ message: '章节标题不能为空' });
    }

    // 约束检查：如果 parent_id 存在，检查父节点是否已有内容
    if (parent_id) {
      const parentChapter = await Chapter.findByPk(parent_id);
      if (!parentChapter) {
        return res.status(404).json({ message: '父章节不存在' });
      }
      
      // 如果父章节有内容，禁止添加子章节 (或者提示用户)
      if (parentChapter.content || parentChapter.video_url || parentChapter.resource_url) {
        return res.status(400).json({ message: '该父章节包含内容，无法添加子章节。请先清空父章节内容。' });
      }
    }

    const newChapter = await Chapter.create({
      title,
      content,
      video_url,
      resource_url,
      resource_name,
      order: order || 0,
      course_id,
      parent_id: parent_id || null
    });

    res.status(201).json({
      message: '章节添加成功',
      chapter: newChapter
    });

  } catch (error) {
    console.error('Add chapter error:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
};

exports.updateChapter = async (req, res) => {
  try {
    const { chapter_id } = req.params;
    const { title, content, video_url, resource_url, resource_name, order } = req.body;

    const chapter = await Chapter.findByPk(chapter_id);
    if (!chapter) {
      return res.status(404).json({ message: '章节不存在' });
    }

    // 约束检查：如果尝试更新内容字段
    if (content || video_url || resource_url) {
      // 检查是否有子章节
      const childCount = await Chapter.count({ where: { parent_id: chapter_id } });
      if (childCount > 0) {
        return res.status(400).json({ message: '该章节包含子章节，仅能作为目录，无法添加内容。' });
      }
    }

    chapter.title = title || chapter.title;
    chapter.content = content !== undefined ? content : chapter.content;
    chapter.video_url = video_url !== undefined ? video_url : chapter.video_url;
    chapter.resource_url = resource_url !== undefined ? resource_url : chapter.resource_url;
    chapter.resource_name = resource_name !== undefined ? resource_name : chapter.resource_name;
    chapter.order = order !== undefined ? order : chapter.order;

    await chapter.save();

    res.json({ message: '章节更新成功', chapter });

  } catch (error) {
    console.error('Update chapter error:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
};

exports.getChapters = async (req, res) => {
  try {
    const { course_id } = req.params;
    
    // 获取该课程的所有章节，按 order 排序
    const chapters = await Chapter.findAll({
      where: { course_id },
      order: [['order', 'ASC']],
      raw: true // 获取纯 JSON 数据
    });

    const tree = buildChapterTree(chapters);

    res.json(tree);
  } catch (error) {
    console.error('Get chapters error:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
};

exports.updateProgress = async (req, res) => {
  try {
    const { courseId, chapterId } = req.params;
    const userId = req.user.id;

    // 查找选课记录
    const enrollment = await Enrollment.findOne({
      where: {
        student_id: userId,
        course_id: courseId
      }
    });

    if (!enrollment) {
      return res.status(404).json({ message: '未找到选课记录' });
    }

    // 更新最后访问的章节和时间
    enrollment.last_chapter_id = chapterId;
    enrollment.last_accessed_at = new Date();
    
    // TODO: 这里可以添加逻辑来计算并更新 progress (例如百分比)
    // 目前仅更新最后访问位置

    await enrollment.save();

    res.status(200).json({
      message: '学习进度更新成功',
      data: {
        last_chapter_id: enrollment.last_chapter_id,
        last_accessed_at: enrollment.last_accessed_at
      }
    });
  } catch (error) {
    console.error('Update progress error:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
};
