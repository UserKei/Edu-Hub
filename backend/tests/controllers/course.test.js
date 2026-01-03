const courseController = require('../../controllers/courseController');

// Mock dependencies BEFORE requiring controller
jest.mock('../../models/Course', () => {
  return {
    create: jest.fn(),
    findByPk: jest.fn(),
    findAll: jest.fn(),
    belongsTo: jest.fn(),
    hasMany: jest.fn()
  };
});

jest.mock('../../models/Chapter', () => {
  return {
    count: jest.fn(),
    belongsTo: jest.fn(),
    hasMany: jest.fn()
  };
});

jest.mock('../../models/Enrollment', () => {
  return {
    findOne: jest.fn(),
    create: jest.fn(),
    belongsTo: jest.fn()
  };
});

jest.mock('../../models/ChapterProgress', () => {
  return {
    belongsTo: jest.fn()
  };
});

// Also mock User since it's used in associations
jest.mock('../../models/User', () => {
  return {
    hasMany: jest.fn()
  };
});

const Course = require('../../models/Course');
const Chapter = require('../../models/Chapter');
const Enrollment = require('../../models/Enrollment');

describe('Course Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
      user: { id: 1, role: 'TEACHER' }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  describe('createCourse', () => {
    it('should create a course successfully', async () => {
      req.body = {
        title: 'New Course',
        description: 'Course Description',
        teacher_id: 1
      };

      Course.create.mockResolvedValue({
        id: 1,
        title: 'New Course',
        description: 'Course Description',
        teacher_id: 1,
        status: 'DRAFT'
      });

      await courseController.createCourse(req, res);

      expect(Course.create).toHaveBeenCalledWith(expect.objectContaining({
        title: 'New Course',
        teacher_id: 1,
        status: 'DRAFT'
      }));
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: '课程创建成功',
        course: expect.any(Object)
      }));
    });

    it('should return 400 if title is missing', async () => {
      req.body = {
        description: 'Missing Title',
        teacher_id: 1
      };

      await courseController.createCourse(req, res);

      expect(Course.create).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: '课程标题不能为空' });
    });

    it('should return 400 if teacher_id is missing', async () => {
      req.body = {
        title: 'Missing Teacher ID'
      };

      await courseController.createCourse(req, res);

      expect(Course.create).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: '教师ID不能为空' });
    });
  });

  describe('getCourseList', () => {
    it('should return a list of published courses', async () => {
      const mockCourses = [
        { id: 1, title: 'Course 1', status: 'PUBLISHED' },
        { id: 2, title: 'Course 2', status: 'PUBLISHED' }
      ];

      Course.findAll.mockResolvedValue(mockCourses);

      await courseController.getCourseList(req, res);

      expect(Course.findAll).toHaveBeenCalledWith({ where: { status: 'PUBLISHED' } });
      expect(res.json).toHaveBeenCalledWith(mockCourses);
    });
  });

  describe('getCreatedCourses', () => {
    it('should return a list of courses created by the teacher', async () => {
      const mockCourses = [
        { id: 1, title: 'My Course 1', teacher_id: 1 },
        { id: 2, title: 'My Course 2', teacher_id: 1 }
      ];

      Course.findAll.mockResolvedValue(mockCourses);

      await courseController.getCreatedCourses(req, res);

      expect(Course.findAll).toHaveBeenCalledWith(expect.objectContaining({
        where: { teacher_id: 1 },
        order: [['created_at', 'DESC']]
      }));
      expect(res.json).toHaveBeenCalledWith(mockCourses);
    });
  });

  describe('getCourseDetail', () => {
    it('should return course details if found', async () => {
      req.params.id = 1;
      const mockCourse = { id: 1, title: 'Course 1' };

      Course.findByPk.mockResolvedValue(mockCourse);

      await courseController.getCourseDetail(req, res);

      expect(Course.findByPk).toHaveBeenCalledWith(1);
      expect(res.json).toHaveBeenCalledWith(mockCourse);
    });

    it('should return 404 if course not found', async () => {
      req.params.id = 999;
      Course.findByPk.mockResolvedValue(null);

      await courseController.getCourseDetail(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: '课程不存在' });
    });
  });

  describe('publishCourse', () => {
    it('should publish a course if it has chapters', async () => {
      req.params.id = 1;
      const mockCourse = { 
        id: 1, 
        status: 'DRAFT', 
        save: jest.fn().mockResolvedValue(true) 
      };

      Course.findByPk.mockResolvedValue(mockCourse);
      Chapter.count.mockResolvedValue(5); // Has chapters

      await courseController.publishCourse(req, res);

      expect(mockCourse.status).toBe('PUBLISHED');
      expect(mockCourse.save).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: '课程发布成功'
      }));
    });

    it('should return 400 if course has no chapters', async () => {
      req.params.id = 1;
      const mockCourse = { id: 1, status: 'DRAFT' };

      Course.findByPk.mockResolvedValue(mockCourse);
      Chapter.count.mockResolvedValue(0); // No chapters

      await courseController.publishCourse(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: expect.stringContaining('至少需要包含一个章节')
      }));
    });

    it('should return 404 if course not found', async () => {
      req.params.id = 999;
      Course.findByPk.mockResolvedValue(null);

      await courseController.publishCourse(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });
});
