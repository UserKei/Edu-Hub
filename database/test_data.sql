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
