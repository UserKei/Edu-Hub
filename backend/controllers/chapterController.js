const Chapter = require('../models/Chapter');
const Enrollment = require('../models/Enrollment');
const ChapterProgress = require('../models/ChapterProgress');

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
    const { progress, status } = req.body;

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
    await enrollment.save();

    // 更新章节进度
    const isCompleted = status === 'COMPLETED' || progress >= 100;
    
    // 使用 upsert 更新或插入进度记录
    // 注意：ChapterProgress 模型中定义了 unique_user_chapter 索引
    const [chapterProgress] = await ChapterProgress.upsert({
      user_id: userId,
      chapter_id: chapterId,
      course_id: courseId,
      progress: progress || 0,
      is_completed: isCompleted
    });

    // 如果是已完成，确保 is_completed 为 true (upsert 会覆盖，但为了保险起见，如果之前是 true，现在也是 true)
    // 如果之前是 true，现在 progress < 100，是否要改回 false？通常不需要，完成过一次就算完成。
    // 但上面的 upsert 会直接用新的值覆盖。
    // 改进逻辑：如果已经完成，就不应该变回未完成，除非显式重置。
    // 但为了简单起见，我们假设前端传递的状态是准确的。
    // 或者我们可以先查询一下，如果已经是 completed，就不改 is_completed。
    // 但 upsert 比较方便。我们可以稍微优化一下逻辑：
    
    if (isCompleted) {
        // 如果这次是完成，直接更新
    } else {
        // 如果这次未完成，检查是否曾经完成过？
        // 这一步可能需要先 findOne。
        // 为了性能，暂时直接信任前端传来的状态，或者假设前端会正确处理。
        // 如果前端只是传 progress，没传 status，我们需要小心。
        // 现在的逻辑是 status === 'COMPLETED' || progress >= 100 才设为 true。
        // 如果用户回看，progress 变回 0，is_completed 可能会变回 false。
        // 让我们修正一下：只在 isCompleted 为 true 时更新 is_completed 字段？
        // 或者：
        /*
        const existing = await ChapterProgress.findOne({ where: { user_id: userId, chapter_id: chapterId } });
        if (existing && existing.is_completed) {
             isCompleted = true;
        }
        */
       // 考虑到 upsert 的原子性，我们可以接受简单的覆盖，或者分两步。
       // 让我们用 findOne + save/create 模式更稳妥。
    }

    // 重新实现更稳妥的逻辑
    let cp = await ChapterProgress.findOne({
        where: { user_id: userId, chapter_id: chapterId }
    });

    if (cp) {
        cp.progress = progress !== undefined ? progress : cp.progress;
        if (isCompleted) {
            cp.is_completed = true;
        }
        // 如果之前是 completed，现在不是，保持 completed
        await cp.save();
    } else {
        cp = await ChapterProgress.create({
            user_id: userId,
            chapter_id: chapterId,
            course_id: courseId,
            progress: progress || 0,
            is_completed: isCompleted
        });
    }

    // --- 计算并更新课程总进度 ---
    // 1. 获取该课程所有内容章节的总数 (排除目录)
    // 注意：这里假设没有内容的章节就是目录，或者通过 parent_id 判断。
    // 更准确的是查询所有 type='FILE' 的章节，但数据库里没有 type 字段，是通过 children 判断的。
    // 简化逻辑：查询所有没有子章节的章节？或者查询所有 video_url 或 content 不为空的章节？
    // 让我们回顾一下 getCourseContent 的逻辑：
    /*
      let type = 'FILE';
      if (children.length > 0) type = 'FOLDER';
    */
    // 在数据库层面很难直接用 SQL 判断 "没有子节点的节点"。
    // 另一种方法：查询所有 Chapter，然后在内存中过滤。
    const allChapters = await Chapter.findAll({
      where: { course_id: courseId },
      raw: true
    });
    
    // 找出所有父节点ID
    const parentIds = new Set(allChapters.map(c => c.parent_id).filter(id => id !== null));
    // 叶子节点 = ID 不在 parentIds 中的节点
    const leafChapters = allChapters.filter(c => !parentIds.has(c.id));
    const totalLeafCount = leafChapters.length;

    if (totalLeafCount > 0) {
      // 2. 获取用户已完成的章节数
      const completedCount = await ChapterProgress.count({
        where: {
          user_id: userId,
          course_id: courseId,
          is_completed: true,
          chapter_id: leafChapters.map(c => c.id) // 仅统计叶子节点
        }
      });

      // 3. 计算百分比
      const newProgress = Math.round((completedCount / totalLeafCount) * 100);

      // 4. 更新 Enrollment
      enrollment.progress = newProgress;
      await enrollment.save();
    }

    res.status(200).json({
      message: '学习进度更新成功',
      data: {
        last_chapter_id: enrollment.last_chapter_id,
        last_accessed_at: enrollment.last_accessed_at,
        chapter_progress: cp,
        course_progress: enrollment.progress
      }
    });
  } catch (error) {
    console.error('Update progress error:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
};

exports.deleteChapter = async (req, res) => {
  try {
    const { chapter_id } = req.params;
    const chapter = await Chapter.findByPk(chapter_id);
    
    if (!chapter) {
      return res.status(404).json({ message: '章节不存在' });
    }

    // 递归删除子章节
    const deleteRecursively = async (id) => {
      const children = await Chapter.findAll({ where: { parent_id: id } });
      for (const child of children) {
        await deleteRecursively(child.id);
      }
      await Chapter.destroy({ where: { id } });
    };

    await deleteRecursively(chapter_id);

    res.json({ message: '章节删除成功' });
  } catch (error) {
    console.error('Delete chapter error:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
};
