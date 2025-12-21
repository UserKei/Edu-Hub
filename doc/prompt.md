# 后端开发计划 - 注册功能 (Sequelize ORM)

## 1. 目标
实现用户注册接口，支持学生和教师两种角色。教师注册需验证邀请码。使用 Sequelize 作为 ORM 框架。

## 2. 实施步骤

### 第一步：安装依赖
- **操作**: 安装 `sequelize`, `mysql2`, `cors`, `dotenv`。
- **原因**: 
    - `sequelize` & `mysql2`: 用于连接和操作 MySQL 数据库。
    - `cors`: 解决前后端跨域问题。
    - `dotenv`: 管理环境变量（如数据库密码）。

### 第二步：项目结构搭建
- **操作**: 创建标准的 MVC 目录结构：
    - `config/`: 数据库配置
    - `models/`: Sequelize 模型定义
    - `controllers/`: 业务逻辑
    - `routes/`: 路由定义
- **原因**: 保持代码清晰、可维护，职责分离。

### 第三步：数据库配置与连接
- **操作**: 在 `config/database.js` 中配置 Sequelize 实例，连接到 MySQL。
- **原因**: 建立应用与数据库的通信桥梁。

### 第四步：定义模型 (Models)
- **操作**: 
    - `models/User.js`: 对应数据库 `User` 表。
    - `models/InviteCode.js`: 对应数据库 `InviteCode` 表。
- **原因**: 通过对象操作数据库表，无需手写 SQL。

### 第五步：实现注册逻辑 (Controller)
- **操作**: 在 `controllers/authController.js` 中编写 `register` 函数。
    - 接收参数：`username`, `password`, `nickname`, `role`, `inviteCode`。
    - **校验**: 检查用户名是否已存在。
    - **教师特有逻辑**: 如果 `role === 'TEACHER'`，验证 `InviteCode` 表中是否存在该码且未被使用。验证通过后标记为已使用。
    - **入库**: 创建 User 记录。
- **原因**: 这是核心业务逻辑，确保数据的一致性和安全性。

### 第六步：配置路由 (Routes)
- **操作**: 创建 `routes/authRoutes.js`，将 `/register` 路径映射到 controller。
- **原因**: 定义 API 接口供前端调用。

### 第七步：入口文件集成
- **操作**: 在 `index.js` 中引入路由和中间件。
- **原因**: 启动服务，使接口生效。

# 后端开发计划 - 登录功能

## 1. 目标
实现用户登录接口，验证用户名和密码，并返回 JWT Token。

## 2. 实施步骤

### 第一步：安装依赖
- **操作**: 安装 `jsonwebtoken`。
- **原因**: 用于生成和验证 JWT Token。

### 第二步：配置 JWT 密钥
- **操作**: 在 `.env` 文件中添加 `JWT_SECRET`。
- **原因**: 签名 Token 需要密钥。

### 第三步：实现登录逻辑 (Controller)
- **操作**: 在 `controllers/authController.js` 中编写 `login` 函数。
    - 接收参数：`username`, `password`。
    - **校验**: 验证输入格式。
    - **查询**: 根据用户名查找用户。
    - **验证**: 比对密码（明文）。
    - **生成 Token**: 使用 `jsonwebtoken` 生成包含用户 ID 和角色的 Token。
    - **返回**: 返回 Token 和用户信息。

### 第四步：配置路由 (Routes)
- **操作**: 在 `routes/authRoutes.js` 中添加 `/login` 路由。

## 3. 为什么选择这个方案？
1.  **JWT**: 无状态认证，适合前后端分离架构。
2.  **安全性**: 虽然密码未加密存储（按需求），但 Token 机制保证了后续请求的安全性。

## 3. 为什么选择这个方案？
1.  **Sequelize ORM**: 符合您的技术选型要求，提供了良好的类型安全（虽然是JS，但有提示）和便捷的 CRUD 操作，避免了拼接 SQL 字符串的风险。
2.  **安全性**: 注册环节包含权限控制（教师邀请码）。(注：根据需求，暂不进行密码加密)。
3.  **可扩展性**: 采用 MVC 架构，未来添加“登录”、“课程管理”等功能时，只需增加相应的 Model 和 Controller，不会导致代码混乱。
