USE kei;

-- 1. 插入超级管理员 (密码: admin123)
INSERT INTO User (username, password, nickname, role, status) 
VALUES ('admin', 'admin123', '超级管理员', 'SUPER_ADMIN', 'ACTIVE');

-- 2. 插入普通学生 (密码: 123456)
INSERT INTO User (username, password, nickname, role, status) 
VALUES ('student', '123456', '测试学生', 'STUDENT', 'ACTIVE');

-- 3. 插入被封禁用户 (密码: 123456)
INSERT INTO User (username, password, nickname, role, status) 
VALUES ('banned_user', '123456', '违规用户', 'STUDENT', 'BANNED');

-- 4. 插入测试教师 (密码: 123456)
INSERT INTO User (username, password, nickname, role, status) 
VALUES ('teacher', '123456', '测试教师', 'TEACHER', 'ACTIVE');

-- 5. 插入普通管理员 (密码: 123456)
INSERT INTO User (username, password, nickname, role, status) 
VALUES ('admin_normal', '123456', '普通管理员', 'ADMIN', 'ACTIVE');

-- 4. 插入教师邀请码
-- 有效的邀请码
INSERT INTO InviteCode (code, is_used, expires_at) 
VALUES ('TEACHER_2025', false, '2025-12-31 23:59:59');

-- 另一个测试码 (来自 test_data.sql)
INSERT INTO InviteCode (code, is_used, expires_at) 
VALUES ('HELLO_WORLD', false, '2025-12-31 23:59:59');

-- 已过期的邀请码
INSERT INTO InviteCode (code, is_used, expires_at) 
VALUES ('EXPIRED_CODE', false, '2020-01-01 00:00:00');
