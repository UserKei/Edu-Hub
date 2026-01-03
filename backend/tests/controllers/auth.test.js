const authController = require('../../controllers/authController');
const User = require('../../models/User');
const InviteCode = require('../../models/InviteCode');
const jwt = require('jsonwebtoken');

// Mock dependencies
jest.mock('../../models/User');
jest.mock('../../models/InviteCode');
jest.mock('jsonwebtoken');

describe('Auth Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new student successfully', async () => {
      req.body = {
        username: 'testuser',
        password: 'password123!',
        nickname: 'TestUser', // No space allowed in regex
        role: 'STUDENT'
      };

      User.findOne.mockResolvedValue(null); // User does not exist
      User.create.mockResolvedValue({
        id: 1,
        username: 'testuser',
        nickname: 'TestUser',
        role: 'STUDENT'
      });

      await authController.register(req, res);

      expect(User.findOne).toHaveBeenCalledWith({ where: { username: 'testuser' } });
      expect(User.create).toHaveBeenCalledWith({
        username: 'testuser',
        password: 'password123!',
        nickname: 'TestUser',
        role: 'STUDENT'
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: '注册成功',
        user: expect.objectContaining({ username: 'testuser' })
      }));
    });

    it('should return 400 if username already exists', async () => {
      req.body = {
        username: 'existinguser',
        password: 'password123!',
        role: 'STUDENT'
      };

      User.findOne.mockResolvedValue({ id: 1, username: 'existinguser' });

      await authController.register(req, res);

      expect(User.findOne).toHaveBeenCalled();
      expect(User.create).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: '用户名已被占用' });
    });

    it('should return 400 for invalid username format', async () => {
      req.body = {
        username: 'invalid-user!', // Invalid char
        password: 'password123!'
      };

      await authController.register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: expect.stringContaining('用户名只能包含字母')
      }));
    });
  });

  describe('login', () => {
    it('should login successfully with correct credentials', async () => {
      req.body = {
        username: 'testuser',
        password: 'password123!'
      };

      const mockUser = {
        id: 1,
        username: 'testuser',
        password: 'password123!',
        role: 'STUDENT',
        status: 'ACTIVE'
      };

      User.findOne.mockResolvedValue(mockUser);
      jwt.sign.mockReturnValue('mock-token');

      await authController.login(req, res);

      expect(User.findOne).toHaveBeenCalledWith({ where: { username: 'testuser' } });
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: '登录成功',
        token: 'mock-token'
      }));
    });

    it('should return 401 if user not found', async () => {
      req.body = {
        username: 'nonexistent',
        password: 'password123!'
      };

      User.findOne.mockResolvedValue(null);

      await authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: '用户名或密码错误' });
    });

    it('should return 401 if password does not match', async () => {
      req.body = {
        username: 'testuser',
        password: 'wrongpassword'
      };

      const mockUser = {
        id: 1,
        username: 'testuser',
        password: 'password123!', // Correct password
        status: 'ACTIVE'
      };

      User.findOne.mockResolvedValue(mockUser);

      await authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: '用户名或密码错误' });
    });
  });
});
