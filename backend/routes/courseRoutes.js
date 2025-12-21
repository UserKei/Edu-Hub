const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const chapterController = require('../controllers/chapterController');

// 课程路由
router.post('/', courseController.createCourse);
router.get('/', courseController.getCourseList);
router.get('/:id', courseController.getCourseDetail);
router.put('/:id', courseController.updateCourse);
router.patch('/:id/publish', courseController.publishCourse);

// 章节路由
router.post('/:course_id/chapters', chapterController.addChapter);
router.get('/:course_id/chapters', chapterController.getChapters);
router.put('/:course_id/chapters/:chapter_id', chapterController.updateChapter);

module.exports = router;
