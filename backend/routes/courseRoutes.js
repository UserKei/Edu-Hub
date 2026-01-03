const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const chapterController = require('../controllers/chapterController');
const { verifyToken } = require('../middleware/authMiddleware');

// 学生端路由 (需认证) - 必须在 /:id 之前定义
router.get('/enrolled', verifyToken, courseController.getEnrolledCourses);
// 教师端路由 (需认证)
router.get('/created', verifyToken, courseController.getCreatedCourses);

// 课程路由
router.post('/', verifyToken, courseController.createCourse);
router.get('/', courseController.getCourseList);
router.get('/:id', courseController.getCourseDetail);
router.put('/:id', courseController.updateCourse);
router.patch('/:id/publish', courseController.publishCourse);

// 学生选课与学习 (需认证)
router.post('/:id/enroll', verifyToken, courseController.enrollCourse);
router.get('/:id/content', verifyToken, courseController.getCourseContent);

// 章节路由
router.post('/:course_id/chapters', chapterController.addChapter);
router.get('/:course_id/chapters', chapterController.getChapters);
router.put('/:course_id/chapters/:chapter_id', chapterController.updateChapter);
router.delete('/:course_id/chapters/:chapter_id', chapterController.deleteChapter);

// 学习进度 (需认证)
router.post('/:courseId/chapters/:chapterId/progress', verifyToken, chapterController.updateProgress);

module.exports = router;
