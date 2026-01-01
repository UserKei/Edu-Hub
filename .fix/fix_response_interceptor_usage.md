# 修复：课程创建 Store 中的 TypeError

## 问题描述
用户在创建课程时报告了 `TypeError: Cannot read properties of undefined (reading 'course')` 错误。
错误发生在 `src/stores/course-creation.js` 的第 28 行：
```javascript
this.courseId = res.data.course.id
```

## 根本原因分析
1.  **响应拦截器**：`src/utils/request.js` 文件包含一个响应拦截器：
    ```javascript
    service.interceptors.response.use(
      (response) => {
        return response.data
      },
      // ...
    )
    ```
    这意味着当 `request.post(...)` 解析时，它直接返回 **响应体**，而不是完整的 Axios 响应对象。

2.  **Store 中的错误用法**：在 `src/stores/course-creation.js` 中，代码期望完整的 Axios 响应对象：
    ```javascript
    const res = await request.post('/api/courses', data)
    this.courseId = res.data.course.id // 'res' 已经是响应体了。'res.data' 是 undefined。
    ```
    由于 `res` 已经是 `{ message: "...", course: {...} }`，访问 `res.data` 返回 `undefined`。尝试在 `undefined` 上访问 `.course` 会抛出 TypeError。

## 解决方案计划
更新 `src/stores/course-creation.js`，移除所有 action 中多余的 `.data` 属性访问。

### 需要的更改

#### 1. `createCourse`
**修改前：**
```javascript
const res = await request.post('/api/courses', data)
this.courseId = res.data.course.id
this.courseInfo = { ...this.courseInfo, ...res.data.course }
return res.data
```
**修改后：**
```javascript
const res = await request.post('/api/courses', data)
this.courseId = res.course.id
this.courseInfo = { ...this.courseInfo, ...res.course }
return res
```

#### 2. `updateCourse`
**修改前：**
```javascript
const res = await request.put(`/api/courses/${this.courseId}`, data)
this.courseInfo = { ...this.courseInfo, ...res.data.course }
return res.data
```
**修改后：**
```javascript
const res = await request.put(`/api/courses/${this.courseId}`, data)
this.courseInfo = { ...this.courseInfo, ...res.course }
return res
```

#### 3. `fetchCourse`
**修改前：**
```javascript
const res = await request.get(`/api/courses/${id}`)
this.courseId = res.data.id
this.courseInfo = res.data
return res.data
```
**修改后：**
```javascript
const res = await request.get(`/api/courses/${id}`)
// 假设 GET /api/courses/:id 直接返回课程对象或 { id: ... }
// 根据 doc/api/course_management.md，它直接返回课程对象。
this.courseId = res.id
this.courseInfo = res
return res
```

#### 4. `fetchChapters`
**修改前：**
```javascript
const res = await request.get(`/api/courses/${courseId}/chapters`)
this.chapters = res.data
return res.data
```
**修改后：**
```javascript
const res = await request.get(`/api/courses/${courseId}/chapters`)
// 根据 doc/api/course_management.md，它返回一个数组。
this.chapters = res
return res
```

#### 5. `addChapter`
**修改前：**
```javascript
const res = await request.post(`/api/courses/${this.courseId}/chapters`, data)
await this.fetchChapters(this.courseId)
return res.data
```
**修改后：**
```javascript
const res = await request.post(`/api/courses/${this.courseId}/chapters`, data)
await this.fetchChapters(this.courseId)
return res
```

#### 6. `updateChapter`
**修改前：**
```javascript
const res = await request.put(...)
resolve(res.data)
```
**修改后：**
```javascript
const res = await request.put(...)
resolve(res)
```

#### 7. `publishCourse`
**修改前：**
```javascript
const res = await request.patch(`/api/courses/${this.courseId}/publish`)
this.courseInfo.status = 'PUBLISHED'
return res.data
```
**修改后：**
```javascript
const res = await request.patch(`/api/courses/${this.courseId}/publish`)
this.courseInfo.status = 'PUBLISHED'
return res
```

