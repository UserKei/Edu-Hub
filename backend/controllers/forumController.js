const Post = require('../models/Post');
const Comment = require('../models/Comment');
const User = require('../models/User');

// 获取帖子列表
exports.getPosts = async (req, res) => {
  try {
    const { page = 1, limit = 10, course_id } = req.query;
    const offset = (page - 1) * limit;
    const where = {};

    if (course_id) {
      where.course_id = course_id;
    }

    const { count, rows } = await Post.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']],
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'nickname', 'avatar', 'role']
        }
      ]
    });

    res.json({
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      posts: rows
    });
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
};

// 获取帖子详情
exports.getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findByPk(id, {
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'nickname', 'avatar', 'role']
        },
        {
          model: Comment,
          as: 'comments',
          include: [
            {
              model: User,
              as: 'author',
              attributes: ['id', 'nickname', 'avatar', 'role']
            }
          ]
        }
      ],
      order: [[{ model: Comment, as: 'comments' }, 'created_at', 'ASC']]
    });

    if (!post) {
      return res.status(404).json({ message: '帖子不存在' });
    }

    res.json(post);
  } catch (error) {
    console.error('Get post detail error:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
};

// 发布帖子
exports.createPost = async (req, res) => {
  try {
    const { title, content, course_id, chapter_id } = req.body;
    const author_id = req.user.id;

    const newPost = await Post.create({
      title,
      content,
      author_id,
      course_id: course_id || null,
      chapter_id: chapter_id || null
    });

    res.status(201).json(newPost);
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
};

// 删除帖子
exports.deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    const post = await Post.findByPk(id);
    if (!post) {
      return res.status(404).json({ message: '帖子不存在' });
    }

    // 只有作者或管理员可以删除
    if (post.author_id !== userId && userRole !== 'ADMIN' && userRole !== 'SUPER_ADMIN') {
      return res.status(403).json({ message: '无权删除此帖子' });
    }

    await post.destroy();
    res.json({ message: '帖子已删除' });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
};

// 发表评论
exports.createComment = async (req, res) => {
  try {
    const { id } = req.params; // post_id
    const { content } = req.body;
    const author_id = req.user.id;

    const post = await Post.findByPk(id);
    if (!post) {
      return res.status(404).json({ message: '帖子不存在' });
    }

    const newComment = await Comment.create({
      content,
      post_id: id,
      author_id
    });

    // 返回完整的评论信息（包含作者）
    const commentWithAuthor = await Comment.findByPk(newComment.id, {
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'nickname', 'avatar', 'role']
        }
      ]
    });

    res.status(201).json(commentWithAuthor);
  } catch (error) {
    console.error('Create comment error:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
};

// 删除评论
exports.deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    const comment = await Comment.findByPk(id);
    if (!comment) {
      return res.status(404).json({ message: '评论不存在' });
    }

    if (comment.author_id !== userId && userRole !== 'ADMIN' && userRole !== 'SUPER_ADMIN') {
      return res.status(403).json({ message: '无权删除此评论' });
    }

    await comment.destroy();
    res.json({ message: '评论已删除' });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
};
