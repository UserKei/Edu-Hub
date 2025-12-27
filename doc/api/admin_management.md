# 管理员接口文档

所有管理员接口都需要在 Header 中携带 JWT Token，且用户角色必须为 `ADMIN` 或 `SUPER_ADMIN`。

**Header 示例**:
```
Authorization: Bearer <your_token_here>
```

## 1. 获取用户列表

- **URL**: `/api/admin/users`
- **Method**: `GET`
- **描述**: 分页获取用户列表，支持按用户名/昵称搜索和按角色筛选。

### 请求参数 (Query Params)

| 参数名 | 类型 | 必填 | 描述 | 默认值 |
| :--- | :--- | :--- | :--- | :--- |
| `page` | number | 否 | 页码 | 1 |
| `limit` | number | 否 | 每页数量 | 10 |
| `search` | string | 否 | 搜索关键词 (匹配用户名或昵称) | - |
| `role` | string | 否 | 角色筛选 (STUDENT, TEACHER, ADMIN) | - |

### 响应结果 (200 OK)

```json
{
  "total": 50,
  "totalPages": 5,
  "currentPage": 1,
  "users": [
    {
      "id": 1,
      "username": "student01",
      "nickname": "张三",
      "role": "STUDENT",
      "status": "ACTIVE",
      "created_at": "2025-12-21T10:00:00.000Z",
      "updated_at": "2025-12-21T10:00:00.000Z"
    }
  ]
}
```

### 错误响应 (401 Unauthorized)

```json
{
  "message": "未提供认证令牌"
}
```

### 错误响应 (403 Forbidden)

**情况 1: Token 无效或过期**
```json
{
  "message": "令牌无效或已过期"
}
```

**情况 2: 角色权限不足**
```json
{
  "message": "权限不足：需要管理员权限"
}
```

## 2. 修改用户状态 (封禁/解封)

- **URL**: `/api/admin/users/:id/status`
- **Method**: `PATCH`
- **Content-Type**: `application/json`
- **描述**: 修改指定用户的账号状态。

### 请求参数 (Request Body)

| 参数名 | 类型 | 必填 | 描述 |
| :--- | :--- | :--- | :--- |
| `status` | string | 是 | 目标状态: `ACTIVE` (正常) 或 `BANNED` (封禁) |

### 响应结果 (200 OK)

```json
{
  "message": "用户状态更新成功",
  "user": {
    "id": 1,
    "username": "student01",
    "nickname": "张三",
    "role": "STUDENT",
    "status": "BANNED",
    "created_at": "2025-12-21T10:00:00.000Z",
    "updated_at": "2025-12-27T10:00:00.000Z"
  }
}
```

### 错误响应 (400 Bad Request)

```json
{
  "message": "无效的状态值"
}
```

### 错误响应 (403 Forbidden)

**情况 1: 试图修改超级管理员**
```json
{
  "message": "无法修改超级管理员的状态"
}
```

**情况 2: 普通管理员试图修改其他管理员**
```json
{
  "message": "权限不足：无法操作管理员账号"
}
```

### 错误响应 (404 Not Found)

```json
{
  "message": "用户不存在"
}
```

## 3. 重置用户密码

- **URL**: `/api/admin/users/:id/reset-password`
- **Method**: `POST`
- **Content-Type**: `application/json`
- **描述**: 将指定用户的密码重置为默认密码 (默认: `123456`)。

### 响应结果 (200 OK)

```json
{
  "message": "密码重置成功",
  "tempPassword": "123456"
}
```

### 错误响应 (403 Forbidden)

```json
{
  "message": "无法重置超级管理员密码"
}
```

### 错误响应 (404 Not Found)

```json
{
  "message": "用户不存在"
}
```

## 4. 生成邀请码

- **URL**: `/api/admin/invite-codes`
- **Method**: `POST`
- **Content-Type**: `application/json`
- **描述**: 生成一个新的教师注册邀请码。

### 响应结果 (201 Created)

```json
{
  "message": "邀请码生成成功",
  "code": {
    "id": 1,
    "code": "8X29A1",
    "is_used": false,
    "created_by": 1,
    "expires_at": null,
    "updated_at": "2025-12-21T10:00:00.000Z",
    "created_at": "2025-12-21T10:00:00.000Z"
  }
}
```

### 错误响应 (401 Unauthorized)

```json
{
  "message": "未提供认证令牌"
}
```

### 错误响应 (403 Forbidden)

**情况 1: Token 无效或过期**
```json
{
  "message": "令牌无效或已过期"
}
```

**情况 2: 角色权限不足**
```json
{
  "message": "权限不足：需要管理员权限"
}
```

## 5. 获取邀请码列表

- **URL**: `/api/admin/invite-codes`
- **Method**: `GET`
- **描述**: 获取所有生成的邀请码及其状态。

### 响应结果 (200 OK)

```json
[
  {
    "id": 1,
    "code": "8X29A1",
    "is_used": false,
    "created_by": 1,
    "expires_at": null,
    "created_at": "2025-12-21T10:00:00.000Z",
    "updated_at": "2025-12-21T10:00:00.000Z"
  },
  {
    "id": 2,
    "code": "USED99",
    "is_used": true,
    "created_by": 1,
    "expires_at": null,
    "created_at": "2025-12-20T10:00:00.000Z",
    "updated_at": "2025-12-20T12:00:00.000Z"
  }
]
```

### 错误响应 (401 Unauthorized)

```json
{
  "message": "未提供认证令牌"
}
```

### 错误响应 (403 Forbidden)

**情况 1: Token 无效或过期**
```json
{
  "message": "令牌无效或已过期"
}
```

**情况 2: 角色权限不足**
```json
{
  "message": "权限不足：需要管理员权限"
}
```
