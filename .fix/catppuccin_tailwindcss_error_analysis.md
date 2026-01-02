# Catppuccin TailwindCSS 错误分析

## 问题描述
在启动前端项目时，Vite 报错：
```
[plugin:@tailwindcss/vite:generate:serve] Can't resolve '@catppuccin/tailwindcss' in '/Users/kei/Project/yuki/frontend/src/assets'
```
错误发生在 `/Users/kei/Project/yuki/frontend/src/assets/main.css` 文件中。

## 原因分析

1.  **使用方式不匹配**：
    在 `main.css` 中，使用了 `@plugin "@catppuccin/tailwindcss";` 语法。
    在 Tailwind CSS v4 中，`@plugin` 指令用于加载 JavaScript 插件（即导出函数的 JS 模块）。

2.  **包结构检查**：
    检查 `node_modules/@catppuccin/tailwindcss/package.json` 发现，该包（版本 `1.0.0`）**没有** `main` 或 `exports` 字段指向任何 JavaScript 文件。
    它只包含 CSS 文件：
    ```json
    "files": [
      "./frappe.css",
      "./macchiato.css",
      "./mocha.css"
    ]
    ```
    这意味着 `@catppuccin/tailwindcss` v1.0.0 是一个纯 CSS 的主题包，专门为 Tailwind CSS v4 的 `@theme` 功能设计的。

3.  **解析失败**：
    当构建工具尝试解析 `@plugin "@catppuccin/tailwindcss"` 时，它试图寻找该包的默认入口点（通常是 `index.js` 或 `package.json` 中指定的 `main` 文件）。由于这些都不存在，解析器抛出了 "Can't resolve" 错误。

## 解决方案

应该使用 CSS 的 `@import` 语法来引入具体的主题文件，而不是使用 `@plugin`。

### 修正代码

编辑 `frontend/src/assets/main.css`：

**修改前：**
```css
@import "tailwindcss";

@plugin "@catppuccin/tailwindcss";
```

**修改后（以 mocha 主题为例）：**
```css
@import "tailwindcss";

@import "@catppuccin/tailwindcss/mocha.css";
```

你可以根据需要选择 `latte.css` (如果存在), `frappe.css`, `macchiato.css`, 或 `mocha.css`。
注意：根据 `package.json` 的 `files` 列表，当前版本似乎只包含 `frappe.css`, `macchiato.css`, `mocha.css`。

## 验证
修改后，Tailwind CSS v4 应该能正确加载 CSS 变量定义，错误将消失。
