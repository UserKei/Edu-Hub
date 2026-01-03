# Edu 在线教育平台 - 自动化测试实施计划 (极简 Mock 版)

## 1. 测试技术栈选型 (Tech Stack)

### 后端 (Backend)
*   **框架**: **Jest**
*   **HTTP 断言**: **Supertest**
*   **策略**: **Mock Everything**
    *   *核心原则*: **不连接真实数据库**。使用 `jest.mock` 模拟 Sequelize Model 的返回值（如 `User.findOne`, `Course.create`）。
    *   *理由*: 交付时间紧迫，Mock 策略运行速度快，环境依赖少，CI 稳定性高。
*   **依赖安装**:
    ```bash
    cd backend
    npm install --save-dev jest supertest
    ```

### 前端 (Frontend)
*   **框架**: **Vitest**
*   **工具库**: **Vue Test Utils**
*   **策略**: **Smoke Testing (冒烟测试)**
    *   *核心原则*: **只验证渲染，不测复杂交互**。确保组件能正常挂载 (`mount`) 且不报错。
    *   *理由*: 快速覆盖核心页面，防止白屏级错误。
*   **依赖安装**:
    ```bash
    cd frontend
    npm install --save-dev vitest @vue/test-utils jsdom
    ```

---

## 2. 测试目录结构规范 (Directory Structure)

### 后端结构
```
backend/
├── tests/
│   ├── controllers/          # Controller 单元测试 (Mock Models)
│   │   ├── auth.test.js
│   │   └── course.test.js
│   └── jest.config.js
├── package.json
└── ...
```

### 前端结构
```
frontend/
├── src/
│   ├── components/
│   │   └── ui/
│   │       ├── __tests__/    # 组件渲染测试
│   │       │   └── AppButton.spec.js
│   ├── views/
│   │   └── __tests__/        # 页面渲染测试
│   │       └── LoginView.spec.js
└── ...
```

---

## 3. 测试实施阶段 (Implementation Phases)

### Phase 1: 基础环境搭建 (Infrastructure)
*   **后端**:
    *   安装 Jest。
    *   配置 `package.json`: `"test": "jest"`.
    *   **无需**配置数据库连接或 `.env.test`。
*   **前端**:
    *   安装 Vitest。
    *   配置 `package.json`: `"test": "vitest"`.

### Phase 2: 后端逻辑测试 (Mock Strategy)
*   **目标**: 验证 Controller 层的业务逻辑（如参数校验、状态码返回）。
*   **方法**:
    *   Mock `req`, `res` 对象。
    *   Mock `User.create` 等数据库方法。
    *   断言 `res.status` 和 `res.json` 的调用参数。

### Phase 3: 前端冒烟测试 (Smoke Testing)
*   **目标**: 确保关键组件和页面能成功渲染。
*   **方法**:
    *   使用 `shallowMount` 或 `mount` 挂载组件。
    *   断言 `wrapper.exists()` 为 `true`。
    *   Mock 掉子组件或外部依赖（如 Router, Pinia）以避免渲染错误。

---

## 4. 具体测试用例清单 (Test Cases Checklist)

### 后端 (Controller Mocks)
*   **Auth Controller** (✅ 已完成)
    *   [x] `register` - 模拟 `User.findOne` 返回 null (用户不存在) -> 验证调用 `User.create` -> 返回 201。
    *   [x] `login` - 模拟 `User.findOne` 返回 User 对象 -> 验证生成 Token -> 返回 200。
*   **Course Controller** (✅ 已完成)
    *   [x] `createCourse` - 验证教师权限 & 字段校验。
    *   [x] `getCourseList` - 验证返回列表格式。
    *   [x] `getCourseDetail` - 验证返回课程及章节树。
*   **Chapter Controller** (✅ 已完成)
    *   [x] `addChapter` - 验证章节创建 & 树结构更新。
    *   [x] `updateProgress` - 验证进度计算逻辑。
*   **Forum Controller** (✅ 已完成)
    *   [x] `createPost` - 验证发帖逻辑。
    *   [x] `getPosts` - 验证分页逻辑。
    *   [x] `getPostById` - 验证详情及关联查询。
*   **Upload Controller** (✅ 已完成)
    *   [x] `handleUpload` - 验证文件上传响应。

### 前端 (Component Rendering)
*   **App Component** (✅ 已完成)
    *   [x] `App.vue` - 验证应用根组件挂载 (Smoke Test)。

---

## 5. 总结 (Summary)
所有计划内的测试均已完成。
- 后端 Controller 测试覆盖了 Auth, Course, Chapter, Forum, Upload 模块。
- 前端 Smoke Test 覆盖了 App 根组件的挂载。

