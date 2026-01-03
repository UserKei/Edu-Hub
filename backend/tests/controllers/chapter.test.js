const chapterController = require('../../controllers/chapterController');

// Mock dependencies BEFORE requiring controller
jest.mock('../../models/Chapter', () => {
  return {
    create: jest.fn(),
    findByPk: jest.fn(),
    findAll: jest.fn(),
    count: jest.fn(),
    destroy: jest.fn(),
    hasMany: jest.fn(),
    belongsTo: jest.fn()
  };
});

jest.mock('../../models/Enrollment', () => {
  return {
    findOne: jest.fn(),
    belongsTo: jest.fn()
  };
});

jest.mock('../../models/ChapterProgress', () => {
  return {
    upsert: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    count: jest.fn(),
    belongsTo: jest.fn()
  };
});

// Also mock User since it's used in associations
jest.mock('../../models/User', () => {
  return {
    hasMany: jest.fn()
  };
});

const Chapter = require('../../models/Chapter');
const Enrollment = require('../../models/Enrollment');
const ChapterProgress = require('../../models/ChapterProgress');

describe('Chapter Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
      user: { id: 1 }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  describe('addChapter', () => {
    it('should create a chapter successfully', async () => {
      req.params.course_id = 1;
      req.body = {
        title: 'New Chapter',
        content: 'Content'
      };

      Chapter.create.mockResolvedValue({
        id: 1,
        title: 'New Chapter',
        content: 'Content',
        course_id: 1
      });

      await chapterController.addChapter(req, res);

      expect(Chapter.create).toHaveBeenCalledWith(expect.objectContaining({
        title: 'New Chapter',
        course_id: 1
      }));
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: '章节添加成功'
      }));
    });

    it('should return 400 if title is missing', async () => {
      req.params.course_id = 1;
      req.body = {
        content: 'Content'
      };

      await chapterController.addChapter(req, res);

      expect(Chapter.create).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: '章节标题不能为空' });
    });

    it('should return 404 if parent chapter not found', async () => {
      req.params.course_id = 1;
      req.body = {
        title: 'Sub Chapter',
        parent_id: 999
      };

      Chapter.findByPk.mockResolvedValue(null);

      await chapterController.addChapter(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: '父章节不存在' });
    });

    it('should return 400 if parent chapter has content', async () => {
      req.params.course_id = 1;
      req.body = {
        title: 'Sub Chapter',
        parent_id: 1
      };

      Chapter.findByPk.mockResolvedValue({
        id: 1,
        content: 'Some content'
      });

      await chapterController.addChapter(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: expect.stringContaining('该父章节包含内容')
      }));
    });
  });

  describe('updateProgress', () => {
    it('should update progress successfully', async () => {
      req.params = { courseId: 1, chapterId: 10 };
      req.body = { progress: 50 };
      req.user.id = 1;

      const mockEnrollment = {
        student_id: 1,
        course_id: 1,
        save: jest.fn().mockResolvedValue(true)
      };

      Enrollment.findOne.mockResolvedValue(mockEnrollment);
      
      // Mock ChapterProgress.upsert to return [instance, created]
      ChapterProgress.upsert.mockResolvedValue([
        {
          user_id: 1,
          chapter_id: 10,
          progress: 50,
          is_completed: false
        },
        true // created
      ]);

      // Mock Chapter.findAll for progress calculation
      Chapter.findAll.mockResolvedValue([
        { id: 10, parent_id: null }, // Leaf node
        { id: 11, parent_id: null }  // Leaf node
      ]);

      // Mock ChapterProgress.count
      ChapterProgress.count.mockResolvedValue(1); // 1 completed

      await chapterController.updateProgress(req, res);

      expect(Enrollment.findOne).toHaveBeenCalled();
      expect(mockEnrollment.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: '学习进度更新成功'
      }));
    });

    it('should return 404 if enrollment not found', async () => {
      req.params = { courseId: 1, chapterId: 10 };
      Enrollment.findOne.mockResolvedValue(null);

      await chapterController.updateProgress(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: '未找到选课记录' });
    });
  });
});
