# 原生 Alert 替换与 Toast 系统升级计划 (Alert Replacement & Toast Upgrade Plan)

> **目标**: 废弃项目中所有阻塞式的原生 `window.alert()` 调用，引入现代化、轻量级的 **`vue-sonner`** 组件库，并深度集成 **Catppuccin** 主题风格，提升用户体验。

## Phase 1: 扫描与场景分析 (Scan & Analyze)

### 1.1 全局审计 (Global Audit)
我们将使用 `grep` 扫描全项目，识别所有 `alert` 调用点。

**预期扫描命令**:
```bash
grep -r "alert(" src/
```

### 1.2 策略分类 (Strategy Classification)
根据扫描结果，将调用点分为三类处理：

| 场景类型 | 示例代码 | 处理策略 | 目标组件/方法 |
| :--- | :--- | :--- | :--- |
| **调试信息 (Debug)** | `alert(JSON.stringify(data))` | **移除 (Remove)** | `console.log` 或直接删除 |
| **通知反馈 (Notification)** | `alert('保存成功')` | **替换 (Replace)** | `toast.success('保存成功')` |
| **错误提示 (Error)** | `alert('网络错误')` | **替换 (Replace)** | `toast.error('网络错误')` |
| **阻断性确认 (Confirmation)** | `if(confirm('确定删除?'))` | **保留 (Keep)** | 暂时保留，后续计划升级为 Modal/Dialog |

## Phase 2: 组件集成与封装 (Integration & Encapsulation)

### 2.1 依赖安装 (Dependencies)
```bash
npm install vue-sonner
```

### 2.2 全局配置 (Global Configuration)
**File**: `src/App.vue`

在根组件引入 `<Toaster />` 并配置全局样式，确保符合 **Catppuccin** 设计规范。

**Tailwind 类名映射**:
*   **Toast Container**: `bg-ctp-base border border-ctp-surface1 shadow-lg rounded-xl`
*   **Text**: `text-ctp-text text-sm font-medium`
*   **Description**: `text-ctp-subtext0 text-xs`
*   **Success Icon**: `text-ctp-green`
*   **Error Icon**: `text-ctp-red`
*   **Info Icon**: `text-ctp-blue`
*   **Warning Icon**: `text-ctp-yellow`

### 2.3 Composable 封装 (Encapsulation)
**File**: `src/composables/useToast.js`

封装 `vue-sonner` 的核心功能，提供统一的 API 接口，屏蔽底层库细节，方便未来维护。

```javascript
import { toast } from 'vue-sonner'

export function useToast() {
  return {
    success: (msg, options) => toast.success(msg, options),
    error: (msg, options) => toast.error(msg, options),
    info: (msg, options) => toast.info(msg, options),
    warning: (msg, options) => toast.warning(msg, options),
    promise: (promise, options) => toast.promise(promise, options),
    // 扩展: 自定义 Catppuccin 风格的 toast
  }
}
```

## Phase 3: 代码替换执行 (Refactoring Execution)

### 3.1 执行步骤
1.  **Setup**: 创建 `src/composables/useToast.js`。
2.  **Config**: 修改 `src/App.vue` 添加 `<Toaster />`。
3.  **Refactor**: 逐个文件替换 `alert()`。

### 3.2 替换模式 (Refactoring Pattern)

**Before**:
```javascript
// src/views/LoginView.vue
const handleLogin = async () => {
  try {
    await login()
    alert('登录成功')
  } catch (e) {
    alert('登录失败: ' + e.message)
  }
}
```

**After**:
```javascript
// src/views/LoginView.vue
import { useToast } from '@/composables/useToast' // 1. Import

const { toast } = useToast() // 2. Destructure

const handleLogin = async () => {
  try {
    await login()
    toast.success('登录成功') // 3. Replace
  } catch (e) {
    toast.error('登录失败: ' + e.message) // 3. Replace
  }
}
```

## Phase 4: 文档沉淀 (Documentation)

### 4.1 为什么废弃原生 Alert?
*   **阻塞性**: `alert` 会暂停 JavaScript 执行，冻结 UI，体验极差。
*   **样式不可控**: 无法统一 UI 风格，与 Catppuccin 主题格格不入。
*   **功能单一**: 无法表达 "Loading"、"Promise" 等复杂状态。

### 4.2 API 指南 (API Guide)
推荐使用 `useToast` composable。

```javascript
const { toast } = useToast()

// 基础用法
toast.success('Operation successful')
toast.error('Something went wrong')

// Promise 模式 (自动处理 Loading/Success/Error)
toast.promise(apiCall(), {
  loading: 'Saving...',
  success: 'Saved successfully',
  error: 'Failed to save'
})
```

### 4.3 最佳实践 (Best Practices)
*   **Toast**: 用于非阻断性的状态反馈（成功、失败、加载中）。
*   **Dialog/Modal**: 用于需要用户决策的阻断性操作（确认删除、表单填写）。**不要用 Toast 做确认操作。**
