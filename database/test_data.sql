-- 插入测试用的教师邀请码
-- 邀请码: TEACHER_2025, 状态: 未使用
INSERT INTO InviteCode (code, is_used) VALUES ('TEACHER_2025', false);

-- 插入另一个测试码
INSERT INTO InviteCode (code, is_used) VALUES ('HELLO_WORLD', false);

-- 查询所有邀请码
-- SELECT * FROM InviteCode;

-- 清空邀请码表数据 (慎用，会删除所有邀请码)
-- DELETE FROM InviteCode;

-- 或者使用 TRUNCATE 重置 ID 计数
-- TRUNCATE TABLE InviteCode;

-- ==========================================
-- 清理注册测试数据 (删除两个表的数据)
-- ==========================================

-- 1. 删除所有用户
-- 注意：如果 User 表被 Course 等其他表引用，需要先删除那些表的数据
DELETE FROM User;

-- 2. 删除所有邀请码
DELETE FROM InviteCode;

-- (可选) 重置自增 ID
-- ALTER TABLE User AUTO_INCREMENT = 1;
-- ALTER TABLE InviteCode AUTO_INCREMENT = 1;
