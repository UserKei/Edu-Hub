# 登录接口文档

## 接口描述
用户登录接口，验证用户名和密码，返回 JWT Token。

- **URL**: `/api/login`
- **Method**: `POST`
- **Content-Type**: `application/json`

## 请求参数 (Request Body)

| 参数名 | 类型 | 必填 | 描述 | 约束条件 |
| :--- | :--- | :--- | :--- | :--- |
| `username` | string | 是 | 登录账号 | 3-20位，仅允许字母、数字、下划线 |
| `password` | string | 是 | 登录密码 | 6-32位 |

### 请求示例
```json
{
  "username": "student01",
  "password": "password123"
}
```

## 响应结果 (Response)

### 成功响应 (200 OK)
```json
{
  "message": "登录成功",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "student01",
    "nickname": "张三",
    "role": "STUDENT",
    "avatar": null
  }
}
```

### 失败响应 (400 Bad Request)

**输入格式错误**
```json
{
  "message": "用户名只能包含字母、数字和下划线，长度 3-20 位"
}
```
*可能的消息:*
- "用户名只能包含字母、数字和下划线，长度 3-20 位"
- "密码长度需在 6-32 个字符之间"

### 失败响应 (401 Unauthorized)

**认证失败**
```json
{
  "message": "用户名或密码错误"
}
```

### 服务器错误 (500 Internal Server Error)
```json
{
  "message": "服务器内部错误"
}
```
