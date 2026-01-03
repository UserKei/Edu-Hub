const uploadController = require('../../controllers/uploadController');

describe('Upload Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {
      file: null,
      protocol: 'http',
      get: jest.fn().mockReturnValue('localhost:3000')
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  describe('handleUpload', () => {
    it('should return success response with file URL when file is present', () => {
      req.file = {
        path: 'uploads/images/test.jpg',
        filename: 'test.jpg',
        mimetype: 'image/jpeg',
        size: 1024
      };

      uploadController.handleUpload(req, res);

      expect(res.json).toHaveBeenCalledWith({
        message: '上传成功',
        url: 'http://localhost:3000/uploads/images/test.jpg',
        filename: 'test.jpg',
        mimetype: 'image/jpeg',
        size: 1024
      });
    });

    it('should return 400 if no file is uploaded', () => {
      req.file = null;

      uploadController.handleUpload(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: '没有文件被上传' });
    });
  });
});
