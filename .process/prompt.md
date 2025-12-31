# 国际化 (i18n) 开发规范

本项目使用 `vue-i18n` (v11) 进行国际化。所有 AI 助手和开发人员在编写代码或生成内容时必须遵守以下准则。

## 支持的语言
- **英语**: `en` (默认)
- **简体中文**: `zh-CN`

## 规则
1.  **禁止硬编码文本**: 严禁在 `<template>` 或 `<script>` 中硬编码面向用户的字符串。必须始终使用翻译键 (translation keys)。
2.  **翻译文件**:
    -   翻译文件存放在 `src/locales/` 目录下。
    -   保持 `en.json` 和 `zh-CN.json` 的同步。如果在其中一个文件中添加了键，必须在另一个文件中也添加。
3.  **Vue 组件中的使用**:
    -   **模板 (Template)**: 使用 `{{ $t('path.to.key') }}` 或 `v-t="'path.to.key'"`.
    -   **脚本 (Composition API)**:
        ```javascript
        import { useI18n } from 'vue-i18n'
        const { t } = useI18n()
        const label = t('path.to.key')
        ```
4.  **键名命名规范**:
    -   使用嵌套键结构: `视图.组件.元素` (例如 `view.component.element`)。
    -   示例: `login.form.username`, `common.buttons.submit`.

## AI 任务清单
- [ ] 创建新视图/组件时，将所有文本提取到翻译文件中。
- [ ] 创建/更新 `src/locales/en.json`。
- [ ] 创建/更新 `src/locales/zh-CN.json`。
- [ ] 确保 `vue-i18n` 插件在 `main.js` 中已正确配置（如果尚未配置）。
