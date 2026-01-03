const forumController = require('../../controllers/forumController');

// Mock dependencies BEFORE requiring controller
jest.mock('../../models/Post', () => {
  return {
    findAndCountAll: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
    destroy: jest.fn(),
    belongsTo: jest.fn(),
    hasMany: jest.fn()
  };
});

jest.mock('../../models/Comment', () => {
  return {
    create: jest.fn(),
    destroy: jest.fn(),
    belongsTo: jest.fn()
  };
});

jest.mock('../../models/User', () => {
  return {
    hasMany: jest.fn()
  };
});

const Post = require('../../models/Post');
const Comment = require('../../models/Comment');

describe('Forum Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
      query: {},
      user: { id: 1 }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  describe('createPost', () => {
    it('should create a post successfully', async () => {
      req.body = {
        title: 'New Post',
        content: 'Content',
        course_id: 1
      };

      Post.create.mockResolvedValue({
        id: 1,
        title: 'New Post',
        content: 'Content',
        author_id: 1,
        course_id: 1
      });

      await forumController.createPost(req, res);

      expect(Post.create).toHaveBeenCalledWith(expect.objectContaining({
        title: 'New Post',
        author_id: 1
      }));
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        title: 'New Post'
      }));
    });
  });

  describe('getPosts', () => {
    it('should return a list of posts with pagination', async () => {
      req.query = { page: 1, limit: 10, course_id: 1 };

      const mockPosts = [
        { id: 1, title: 'Post 1' },
        { id: 2, title: 'Post 2' }
      ];

      Post.findAndCountAll.mockResolvedValue({
        count: 2,
        rows: mockPosts
      });

      await forumController.getPosts(req, res);

      expect(Post.findAndCountAll).toHaveBeenCalledWith(expect.objectContaining({
        where: { course_id: 1 },
        limit: 10,
        offset: 0
      }));
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        total: 2,
        posts: mockPosts
      }));
    });
  });

  describe('getPostById', () => {
    it('should return post details if found', async () => {
      req.params.id = 1;
      const mockPost = { id: 1, title: 'Post 1', comments: [] };

      Post.findByPk.mockResolvedValue(mockPost);

      await forumController.getPostById(req, res);

      expect(Post.findByPk).toHaveBeenCalledWith(1, expect.any(Object));
      expect(res.json).toHaveBeenCalledWith(mockPost);
    });

    it('should return 404 if post not found', async () => {
      req.params.id = 999;
      Post.findByPk.mockResolvedValue(null);

      await forumController.getPostById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: '帖子不存在' });
    });
  });
});
