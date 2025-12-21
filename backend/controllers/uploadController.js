const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 配置存储策略
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath = 'uploads/';
    
    // 根据文件类型决定存储目录
    if (file.mimetype.startsWith('image/')) {
      uploadPath += 'images/';
    } else if (file.mimetype.startsWith('video/')) {
      uploadPath += 'videos/';
    } else {
      uploadPath += 'files/';
    }
    
    // 确保目录存在
    fs.mkdirSync(uploadPath, { recursive: true });
    
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // 生成唯一文件名: timestamp-random-originalName
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// 文件过滤器
const fileFilter = (req, file, cb) => {
  // 这里可以添加更严格的文件类型检查
  cb(null, true);
};

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 500 * 1024 * 1024 // 限制 500MB
  },
  fileFilter: fileFilter
});

exports.uploadMiddleware = upload.single('file');

exports.handleUpload = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: '没有文件被上传' });
  }

  // 构建返回的 URL
  // 注意: 这里假设服务器运行在 localhost:3000，生产环境需要配置域名
  const protocol = req.protocol;
  const host = req.get('host');
  const fileUrl = `${protocol}://${host}/${req.file.path}`;

  res.json({
    message: '上传成功',
    url: fileUrl,
    filename: req.file.filename,
    mimetype: req.file.mimetype,
    size: req.file.size
  });
};
