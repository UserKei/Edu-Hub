-- Initial Data for Yuki Education Platform
-- Generated on 2026-01-01


-- =============================================
-- 1. Users
-- =============================================
INSERT INTO User (id, username, password, nickname, role, status, avatar, created_at, updated_at) VALUES
(1, 'superadmin', '123456', 'Super Admin', 'SUPER_ADMIN', 'ACTIVE', 'https://api.dicebear.com/7.x/avataaars/svg?seed=superadmin', NOW(), NOW()),
(2, 'admin', '123456', 'System Admin', 'ADMIN', 'ACTIVE', 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin', NOW(), NOW()),
(3, 'teacher1', '123456', 'Alice Teacher', 'TEACHER', 'ACTIVE', 'https://api.dicebear.com/7.x/avataaars/svg?seed=teacher1', NOW(), NOW()),
(4, 'teacher2', '123456', 'Bob Professor', 'TEACHER', 'ACTIVE', 'https://api.dicebear.com/7.x/avataaars/svg?seed=teacher2', NOW(), NOW()),
(5, 'student1', '123456', 'Charlie Student', 'STUDENT', 'ACTIVE', 'https://api.dicebear.com/7.x/avataaars/svg?seed=student1', NOW(), NOW()),
(6, 'student2', '123456', 'Dave Learner', 'STUDENT', 'ACTIVE', 'https://api.dicebear.com/7.x/avataaars/svg?seed=student2', NOW(), NOW()),
(7, 'student3', '123456', 'Eve Newbie', 'STUDENT', 'BANNED', 'https://api.dicebear.com/7.x/avataaars/svg?seed=student3', NOW(), NOW());

-- =============================================
-- 2. Invite Codes
-- =============================================
INSERT INTO InviteCode (id, code, is_used, created_by, expires_at, created_at) VALUES
(1, 'TEACHER2024', true, 2, '2025-12-31 23:59:59', NOW()),
(2, 'WELCOME2025', false, 2, '2025-12-31 23:59:59', NOW());

-- =============================================
-- 3. Courses
-- =============================================
INSERT INTO Course (id, title, description, cover_image, type, access_code, status, ban_reason, teacher_id, created_at, updated_at) VALUES
(1, 'Full Stack Web Development', 'Learn Vue.js, Node.js, and MySQL from scratch. This comprehensive course covers everything from basic HTML to advanced backend architecture.', 'https://placehold.co/600x400/3b82f6/ffffff?text=Web+Dev', 'PUBLIC', NULL, 'PUBLISHED', NULL, 3, NOW(), NOW()),
(2, 'Advanced React Patterns', 'Master HOCs, Render Props, and Custom Hooks. Designed for experienced developers looking to level up their React skills.', 'https://placehold.co/600x400/6366f1/ffffff?text=React', 'PRIVATE', 'REACT123', 'PUBLISHED', NULL, 3, NOW(), NOW()),
(3, 'Node.js Deep Dive', 'Understanding the Event Loop, Streams, and Buffers. A deep dive into the internals of Node.js.', 'https://placehold.co/600x400/22c55e/ffffff?text=NodeJS', 'PUBLIC', NULL, 'DRAFT', NULL, 3, NOW(), NOW()),
(4, 'Python for Data Science', 'Pandas, NumPy, and Matplotlib. Start your journey into Data Science with Python.', 'https://placehold.co/600x400/eab308/ffffff?text=Python', 'PUBLIC', NULL, 'PUBLISHED', NULL, 4, NOW(), NOW()),
(5, 'Legacy Python 2.7', 'Historical archive of Python 2. This course is no longer maintained but kept for archival purposes.', 'https://placehold.co/600x400/94a3b8/ffffff?text=Legacy', 'PUBLIC', NULL, 'ARCHIVED', NULL, 4, NOW(), NOW());

-- =============================================
-- 4. Chapters
-- =============================================
INSERT INTO Chapter (id, title, content, video_url, resource_url, resource_name, `order`, course_id, parent_id) VALUES
-- Course 1: Web Dev
(1, '1. Introduction', NULL, NULL, NULL, NULL, 1, 1, NULL),
(2, '1.1 Setup Environment', 'Install Node.js and VS Code. Make sure you have the latest version installed.', 'https://www.w3schools.com/html/mov_bbb.mp4', NULL, NULL, 1, 1, 1),
(3, '1.2 VS Code Extensions', 'Recommended extensions for Vue development: Vetur, ESLint, Prettier.', 'https://www.w3schools.com/html/mov_bbb.mp4', 'https://example.com/extensions.json', 'extensions.json', 2, 1, 1),
(4, '2. HTML Basics', NULL, NULL, NULL, NULL, 2, 1, NULL),
(5, '2.1 Semantic HTML', 'Understanding header, main, footer tags and why they are important for SEO and accessibility.', 'https://www.w3schools.com/html/mov_bbb.mp4', NULL, NULL, 1, 1, 4),
-- Course 4: Python
(6, '1. Python Installation', 'Installing Anaconda distribution is recommended for Data Science.', 'https://www.w3schools.com/html/mov_bbb.mp4', NULL, NULL, 1, 4, NULL);

-- =============================================
-- 5. Enrollments
-- =============================================
INSERT INTO Enrollment (id, student_id, course_id, grade, progress, joined_at, last_chapter_id, last_accessed_at) VALUES
(1, 5, 1, NULL, 20, NOW(), 2, NOW()),
(2, 6, 1, NULL, 0, NOW(), NULL, NOW()),
(3, 5, 4, 85.5, 100, NOW(), 6, NOW()),
(4, 7, 2, NULL, 10, NOW(), NULL, NOW());

-- =============================================
-- 6. Posts (Forum)
-- =============================================
INSERT INTO Post (id, title, content, published, author_id, course_id, chapter_id, created_at, updated_at) VALUES
(1, 'Welcome to the course!', 'Feel free to ask any questions here. I will try to answer them as soon as possible.', true, 3, 1, NULL, NOW(), NOW()),
(2, 'Question about VS Code', 'Which theme are you using in the video? It looks very nice.', true, 5, 1, 3, NOW(), NOW()),
(3, 'Python version', 'Should we use Python 3.11 or 3.12? I heard 3.12 has some performance improvements.', true, 6, 4, NULL, NOW(), NOW());

-- =============================================
-- 7. Comments
-- =============================================
INSERT INTO Comment (id, content, author_id, post_id, created_at) VALUES
(1, 'I am using Catppuccin theme. It is very easy on the eyes.', 3, 2, NOW()),
(2, 'Either is fine, but 3.12 is recommended for this course.', 4, 3, NOW());
