CREATE DATABASE IF NOT EXISTS kei;
USE kei;

-- User Table
CREATE TABLE IF NOT EXISTS User (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE COMMENT '登录账号 (唯一ID)',
    password VARCHAR(255) NOT NULL,
    nickname VARCHAR(255) COMMENT '用户昵称 (显示名)',
    avatar VARCHAR(255),
    role ENUM('STUDENT', 'TEACHER', 'ADMIN', 'SUPER_ADMIN') DEFAULT 'STUDENT' COMMENT '角色',
    status ENUM('ACTIVE', 'BANNED') DEFAULT 'ACTIVE' COMMENT '账号状态',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) COMMENT='用户表。管理员(ADMIN)需由超级管理员(SUPER_ADMIN)直接添加，不通过注册流程。';

-- InviteCode Table
CREATE TABLE IF NOT EXISTS InviteCode (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(255) NOT NULL UNIQUE COMMENT '仅用于注册教师账号的邀请码',
    is_used BOOLEAN DEFAULT FALSE,
    created_by INT COMMENT '创建该邀请码的管理员ID',
    expires_at DATETIME COMMENT '过期时间',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) COMMENT='教师注册邀请码表。仅用于将新注册用户提升为 TEACHER 角色。';

-- Course Table
CREATE TABLE IF NOT EXISTS Course (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    cover_image VARCHAR(255),
    type ENUM('PUBLIC', 'PRIVATE') DEFAULT 'PUBLIC' COMMENT '课程类型',
    access_code VARCHAR(255) COMMENT '私有课程必填，相当于入场券密码',
    status ENUM('DRAFT', 'PUBLISHED', 'OFFLINE', 'ARCHIVED', 'BANNED') DEFAULT 'DRAFT' COMMENT '课程状态',
    ban_reason VARCHAR(255) COMMENT '仅在 status=BANNED 时有值，记录管理员封禁的具体原因',
    teacher_id INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (teacher_id) REFERENCES User(id)
) COMMENT='课程表。私有课需要 access_code 才能加入；ban_reason 记录违规原因';

-- Chapter Table
CREATE TABLE IF NOT EXISTS Chapter (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT COMMENT '图文内容',
    video_url VARCHAR(255) COMMENT '视频地址',
    resource_url VARCHAR(255) COMMENT '课件/资料链接',
    resource_name VARCHAR(255) COMMENT '课件文件名',
    `order` INT DEFAULT 0,
    course_id INT NOT NULL,
    parent_id INT,
    FOREIGN KEY (course_id) REFERENCES Course(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES Chapter(id)
) COMMENT='章节表';

-- Enrollment Table
CREATE TABLE IF NOT EXISTS Enrollment (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    course_id INT NOT NULL,
    grade FLOAT COMMENT '考试成绩',
    progress INT DEFAULT 0,
    joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_chapter_id INT COMMENT '最后访问的章节ID',
    last_accessed_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '最后访问时间',
    FOREIGN KEY (student_id) REFERENCES User(id),
    FOREIGN KEY (course_id) REFERENCES Course(id),
    FOREIGN KEY (last_chapter_id) REFERENCES Chapter(id) ON DELETE SET NULL
) COMMENT='选课记录 (User <-> Course 多对多)';

-- ChapterProgress Table
CREATE TABLE IF NOT EXISTS ChapterProgress (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    chapter_id INT NOT NULL,
    course_id INT NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    progress INT DEFAULT 0,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES User(id) ON DELETE CASCADE,
    FOREIGN KEY (chapter_id) REFERENCES Chapter(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES Course(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_chapter (user_id, chapter_id)
) COMMENT='用户章节学习进度表';

-- Post Table
CREATE TABLE IF NOT EXISTS Post (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    published BOOLEAN DEFAULT TRUE,
    author_id INT NOT NULL,
    course_id INT,
    chapter_id INT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES User(id),
    FOREIGN KEY (course_id) REFERENCES Course(id) ON DELETE CASCADE,
    FOREIGN KEY (chapter_id) REFERENCES Chapter(id) ON DELETE CASCADE
) COMMENT='论坛帖子。可关联课程或章节';

-- Comment Table
CREATE TABLE IF NOT EXISTS Comment (
    id INT AUTO_INCREMENT PRIMARY KEY,
    content TEXT NOT NULL,
    author_id INT NOT NULL,
    post_id INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES User(id),
    FOREIGN KEY (post_id) REFERENCES Post(id) ON DELETE CASCADE
) COMMENT='帖子回复';
