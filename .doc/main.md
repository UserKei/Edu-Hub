# 在线教育平台技术设计文档

## 1. 项目概述

本项目旨在开发一个功能完善的在线教育平台，为用户提供便捷的在线学习体验。

### 1.1 核心目标
- 提供视频教学、在线测试、互动讨论等核心功能。
- 构建稳定、可扩展的系统架构，支持多用户并发访问。

### 1.2 主要功能模块
1.  **用户管理**：注册、登录、角色管理（学生、讲师、管理员）、权限控制。
2.  **课程管理**：课程的增删改查、章节管理、课程发布。
3.  **视频播放**：视频上传、转码处理（可选）、流媒体播放。
4.  **在线测试**：题库管理、试卷生成、在线答题、自动评分。
5.  **社区互动**：课程评论、问答区、实时聊天/通知。

### 1.3 用例图 (Use Case Diagram)

```puml
@startuml
left to right direction
actor "学生" as Student
actor "讲师" as Instructor
actor "管理员" as Admin

package "用户系统" {
    usecase "注册/登录" as UC_Auth
    usecase "个人信息管理" as UC_Profile
}

package "课程系统" {
    usecase "浏览课程" as UC_Browse
    usecase "选课/购买" as UC_Enroll
    usecase "观看视频" as UC_Watch
    usecase "发布/管理课程" as UC_ManageCourse
    usecase "上传视频" as UC_UploadVideo
}

package "考试与互动" {
    usecase "参加在线测试" as UC_TakeTest
    usecase "创建试卷" as UC_CreateTest
    usecase "发表评论/提问" as UC_Discuss
}

Student --> UC_Auth
Student --> UC_Profile
Student --> UC_Browse
Student --> UC_Enroll
Student --> UC_Watch
Student --> UC_TakeTest
Student --> UC_Discuss

Instructor --> UC_Auth
Instructor --> UC_Profile
Instructor --> UC_ManageCourse
Instructor --> UC_UploadVideo
Instructor --> UC_CreateTest
Instructor --> UC_Discuss

Admin --> UC_Auth
Admin --> UC_ManageCourse
Admin --> UC_Profile
@enduml
```

---

## 2. 技术架构

### 2.1 技术选型
- **前端 (Frontend)**: Next.js, React
- **后端 (Backend)**: TypeScript, Node.js, Express
- **数据库 (Database)**: MySQL
- **其他**: 视频存储 (如 AWS S3 或 OSS，待定), 实时通信 (Socket.io，用于聊天)

### 2.2 系统架构图

```mermaid
graph LR
    subgraph Client [Client Side]
        web[Next.js Web App]
    end
    
    subgraph API [API Services]
        backend[Node.js/Express Backend]
        db[(MySQL Database)]
        storage[(Video Storage S3/OSS)]
    end

    web -->|HTTP/REST| backend
    backend -->|SQL| db
    backend -->|Upload/Stream| storage
```

或者使用更详细的流程图：

```mermaid
graph TD
    Client["客户端 (Next.js/React)"] -->|HTTP/WebSocket| LB["负载均衡/API网关"]
    LB --> Server["后端服务 (Node.js/Express)"]
    
    subgraph Data Layer
        Server -->|读写| DB[("MySQL 数据库")]
        Server -->|视频文件| Storage["对象存储 (S3/OSS)"]
        Server -->|缓存| Redis["Redis 缓存 (可选)"]
    end
    
    subgraph External Services
        Server -->|邮件/短信| Notification["通知服务"]
    end
```

---

## 3. 数据库设计

### 3.1 实体关系图 (ER Diagram)

```mermaid
erDiagram
    User ||--o{ Course : "creates (instructor)"
    User ||--o{ Enrollment : "enrolls"
    User ||--o{ Post : "writes"
    User ||--o{ TestResult : "takes"
    
    Course ||--|{ Module : "contains"
    Course ||--o{ Enrollment : "has"
    Course ||--o{ Test : "includes"
    
    Module ||--|{ Video : "contains"
    
    Test ||--|{ Question : "contains"
    Test ||--o{ TestResult : "generates"
    
    Post ||--o{ Comment : "has"

    User {
        int id PK
        string username
        string email
        string password_hash
        enum role "student, instructor, admin"
        datetime created_at
    }

    Course {
        int id PK
        string title
        text description
        int instructor_id FK
        float price
        datetime created_at
    }

    Enrollment {
        int id PK
        int user_id FK
        int course_id FK
        datetime enrolled_at
        float progress
    }

    Video {
        int id PK
        int module_id FK
        string title
        string url
        int duration_seconds
    }

    Test {
        int id PK
        int course_id FK
        string title
        int time_limit_minutes
    }

    Question {
        int id PK
        int test_id FK
        text content
        json options
        string correct_answer
        int points
    }

    TestResult {
        int id PK
        int user_id FK
        int test_id FK
        int score
        datetime completed_at
    }
```

---

## 4. 核心业务流程

### 4.1 用户注册与登录

```mermaid
sequenceDiagram
    participant User as 用户
    participant Client as 前端 (Next.js)
    participant API as 后端 API
    participant DB as MySQL

    User->>Client: 输入注册信息
    Client->>API: POST /api/auth/register
    API->>DB: 检查用户是否存在
    alt 用户已存在
        DB-->>API: 返回存在
        API-->>Client: 错误提示
    else 用户不存在
        API->>API: 密码加密
        API->>DB: 创建新用户
        DB-->>API: 成功
        API-->>Client: 注册成功，返回 Token
    end
```

### 4.2 在线测试与自动评分

```mermaid
sequenceDiagram
    participant Student as 学生
    participant Client as 前端界面
    participant API as 后端 API
    participant DB as MySQL

    Student->>Client: 开始测试
    Client->>API: GET /api/tests/:id
    API->>DB: 获取试题信息 (不含答案)
    DB-->>API: 返回试题
    API-->>Client: 返回试卷数据
    
    loop 答题过程
        Student->>Client: 选择/输入答案
    end
    
    Student->>Client: 提交试卷
    Client->>API: POST /api/tests/:id/submit (用户答案)
    
    API->>DB: 获取试题标准答案
    DB-->>API: 返回答案
    
    API->>API: 比对答案，计算得分
    API->>DB: 保存 TestResult (分数, 详情)
    
    API-->>Client: 返回考试结果和分数
    Client->>Student: 显示成绩
```

---

## 5. API 接口概览

详细接口文档请参考：
- [注册接口文档](api/register.md)
- [登录接口文档](api/login.md)

| 模块 | 方法 | 路径 | 描述 |
|---|---|---|---|
| **Auth** | POST | `/api/login` | 用户登录 |
| | POST | `/api/register` | 用户注册 |
| **Courses** | GET | `/api/courses` | 获取课程列表 |
| | GET | `/api/courses/:id` | 获取课程详情 |
| | POST | `/api/courses` | 创建课程 (讲师/管理员) |
| **Videos** | GET | `/api/videos/:id` | 获取视频播放地址 |
| **Tests** | GET | `/api/tests/:courseId` | 获取课程测试 |
| | POST | `/api/tests/:id/submit` | 提交测试答案 |

