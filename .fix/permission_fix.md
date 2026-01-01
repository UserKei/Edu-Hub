# 选课权限问题修复计划

## 1. 问题分析

### 1.1 现象
用户在访问课程学习页面 (`/learn/:courseId`) 时，前端发起 `GET /api/courses/:id/content` 请求，后端返回 `403 Forbidden`。

### 1.2 错误日志
```
GET http://127.0.0.1:3000/api/courses/1/content 403 (Forbidden)
AxiosError: Request failed with status code 403
```

### 1.3 原因排查
通过查看后端代码 `backend/controllers/courseController.js` 中的 `getCourseContent` 方法：

```javascript
// 获取课程内容 (章节树) - 需检查选课状态
exports.getCourseContent = async (req, res) => {
  try {
    const { id } = req.params; // course_id
    const userId = req.user.id;

    // Check enrollment
    const enrollment = await Enrollment.findOne({
      where: {
        student_id: userId,
        course_id: id
      }
    });

    if (!enrollment) {
      return res.status(403).json({ message: '请先加入课程后再进行学习' });
    }
    // ...
```

**结论**：
后端严格检查了 `Enrollment` 表中是否存在 `student_id` 和 `course_id` 的对应记录。如果用户没有“选修”该课程（即 `Enrollment` 表中无记录），后端会直接拒绝访问并返回 403。

当前前端逻辑中，点击课程卡片直接跳转到了 `/learn/:id`，但如果这是一个新课程，用户可能从未点击过“加入课程”或“开始学习”来触发选课接口 (`POST /api/courses/:id/enroll`)。

## 2. 解决方案

我们需要在前端或后端处理“自动选课”或“未选课时的引导”。考虑到用户体验，如果课程是公开的 (`PUBLIC`)，用户点击进入时应该自动选课或允许访问。

### 方案 A：前端引导 (推荐)
在进入 `/learn/:id` 之前，或者在 `/learn/:id` 页面加载时，检查是否已选课。如果未选课，调用选课接口。

### 方案 B：后端自动选课 (本次采用)
为了简化前端逻辑，修改 `getCourseContent` 接口。如果用户未选课，但课程是公开的 (`PUBLIC`)，则自动为用户创建选课记录，然后返回内容。

## 3. 实施步骤 (后端修改)

### 3.1 修改 `backend/controllers/courseController.js`

修改 `getCourseContent` 方法：
1.  查询 `Enrollment`。
2.  如果不存在 `Enrollment`：
    *   查询 `Course` 信息。
    *   如果课程不存在，返回 404。
    *   如果课程是 `PUBLIC` (公开)，则**自动创建**一条 `Enrollment` 记录。
    *   如果课程是 `PRIVATE` (私有)，则返回 403 (保持原样)。
3.  继续后续获取章节逻辑。

### 3.2 代码变更预览

```javascript
// backend/controllers/courseController.js

exports.getCourseContent = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // 1. 尝试获取选课记录
    let enrollment = await Enrollment.findOne({
      where: {
        student_id: userId,
        course_id: id
      }
    });

    // 2. 如果未选课，检查课程属性并尝试自动选课
    if (!enrollment) {
      const course = await Course.findByPk(id);
      if (!course) {
        return res.status(404).json({ message: '课程不存在' });
      }

      // 如果是公开课程，自动选课
      if (course.type === 'PUBLIC') {
        enrollment = await Enrollment.create({
          student_id: userId,
          course_id: id,
          enrolled_at: new Date(),
          progress: 0,
          status: 'IN_PROGRESS'
        });
      } else {
        // 私有课程，必须先通过邀请码或其他方式选课
        return res.status(403).json({ message: '请先加入课程后再进行学习' });
      }
    }

    // ... 后续获取章节代码不变 ...
```

## 4. 验证计划
1.  重启后端服务。
2.  使用未选修该课程的学生账号登录。
3.  点击公开课程卡片进入 `/learn/:id`。
4.  观察网络请求，`GET /content` 应该返回 200，且数据库中会自动生成一条 `Enrollment` 记录。

---
这份开发计划是否准确？如果没问题，我将开始生成代码。
