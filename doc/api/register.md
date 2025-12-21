# 注册接口文档

## 接口描述
用户注册接口，支持学生和教师两种角色。教师注册需要提供有效的邀请码。

- **URL**: `/api/auth/register`
- **Method**: `POST`
- **Content-Type**: `application/json`

## 请求参数 (Request Body)

| 参数名 | 类型 | 必填 | 描述 | 约束条件 |
| :--- | :--- | :--- | :--- | :--- |
| `username` | string | 是 | 登录账号 | 3-20位，仅允许字母、数字、下划线 |
| `password` | string | 是 | 登录密码 | 6-32位，仅允许字母、数字、特殊字符 |
| `nickname` | string | 否 | 用户昵称 | 2-20位，支持中文、字母、数字、下划线 |
| `role` | string | 否 | 用户角色 | 可选值: `STUDENT` (默认), `TEACHER` |
| `inviteCode` | string | 否 | 教师邀请码 | 当 `role` 为 `TEACHER` 时必填 |

### 请求示例 (学生)
```json
{
  "username": "student01",
  "password": "password123",
  "nickname": "张三",
  "role": "STUDENT"
}
```

### 请求示例 (教师)
```json
{
  "username": "teacher01",
  "password": "password123!",
  "nickname": "李老师",
  "role": "TEACHER",
  "inviteCode": "TEACHER_2025"
}
```

## 响应结果 (Response)

### 成功响应 (201 Created)
```json
{
  "message": "注册成功",
  "user": {
    "id": 1,
    "username": "student01",
    "nickname": "张三",
    "role": "STUDENT"
  }
}
```

### 失败响应 (400 Bad Request)

**情况 1: 输入格式错误**
```json
{
  "message": "用户名只能包含字母、数字和下划线，长度 3-20 位"
}
```
*可能的消息:*
- "用户名长度需在 3-20 个字符之间"
- "用户名只能包含字母、数字和下划线，长度 3-20 位"
- "密码长度需在 6-32 个字符之间"
- "密码只能包含字母、数字和特殊字符"
- "昵称长度需在 2-20 个字符之间"
- "昵称只能包含中文、字母、数字和下划线"

**情况 2: 业务逻辑错误**
```json
{
  "message": "用户名已被占用"
}
```
*可能的消息:*
- "用户名已被占用"
- "教师注册需要邀请码"
- "邀请码无效"
- "邀请码已被使用"
- "邀请码已过期"

### 服务器错误 (500 Internal Server Error)
```json
{
  "message": "服务器内部错误"
}
```
