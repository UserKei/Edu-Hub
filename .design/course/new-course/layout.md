# 课程创建模块 - UI 结构逆向分析

---

## 页面 1: Course Creation - Base Information

### 1. 全局页面容器
* **CSS Class:** `.page-wrapper`
* **Figma ID:** Root Container
* **视觉特征:** 1728x1117px 白色背景页面
* **业务逻辑:** 课程创建流程的第一步 - 基础信息填写页面

---

### 2. 顶部导航栏 (Header)
* **CSS Class:** `.header-bar`
* **Figma ID:** `Rectangle 1`
* **视觉特征:** 全宽浅紫色 (A1A4DB) 导航条，高度 137px
* **业务逻辑:** 全局顶部导航容器，承载 Logo、导航菜单和用户信息

#### 2.1 导航栏子元素
1. **Logo 区块:**
   * **Class:** `.logo-icon`
   * **ID:** `Rectangle 2`
   * **功能:** 应用 Logo 图标（黑色方块，50x50px，位于左上角）

2. **导航标签容器:**
   * **Class:** `.nav-tabs-wrapper`
   * **ID:** `Rectangle 3`
   * **功能:** 导航标签背景区域（浅青色 B6FFEE，宽 199px）

3. **当前激活标签:**
   * **Class:** `.nav-tab-active`
   * **ID:** `Rectangle 4`
   * **功能:** 当前页面高亮指示器（蓝紫色 4400FF，50x50px）

4. **用户操作按钮:**
   * **Class:** `.user-action-btn`
   * **ID:** `Rectangle 5`
   * **功能:** 用户头像/菜单触发器（黄绿色 CDF80C，右上角 50x50px）

---

### 3. 主内容区域 (Main Content)
* **CSS Class:** `.main-content-container`
* **Figma ID:** `Rectangle 40`
* **视觉特征:** 深蓝灰色 (596893) 背景板，尺寸 1000x980px，居中显示
* **业务逻辑:** 表单填写的主舞台区域

#### 3.1 表单标题区域
* **Class:** `.form-header`
* **ID:** `Rectangle 44`
* **功能:** 页面标题背景（绿色 5DC794，高 80px）
* **内容:** 显示文本 "Create a new course"

#### 3.2 课程名称输入区
1. **输入框容器:**
   * **Class:** `.input-group-name`
   * **ID:** `Rectangle 41`
   * **功能:** 课程名称输入框背景（青色 00BFFF，高 50px）
   * **Label:** "Course name*" (白色文字，20px)

#### 3.3 课程描述输入区
2. **多行文本框:**
   * **Class:** `.textarea-description`
   * **ID:** `Rectangle 42`
   * **功能:** 课程描述文本域（灰色 D9D9D9，高 106px）
   * **Placeholder:** "Description" (黑色文字，36px)

#### 3.4 课程可见性选择器
3. **选择器容器:**
   * **Class:** `.visibility-selector`
   * **ID:** `Rectangle 43`
   * **功能:** 课程类型选择器背景（青色 00BFFF，高 50px）
   * **Label:** "Choose visibility *" (白色文字，36px)
   * **Hint Text:** "public or private" (右侧灰白色提示，15px)

---

## 页面 2: Course Creation - Chapter Details

### 1. 全局页面容器
* **CSS Class:** `.page-wrapper`
* **Figma ID:** Root Container
* **视觉特征:** 1728x1117px 白色背景页面
* **业务逻辑:** 课程创建流程的第二步 - 章节结构编辑

---

### 2. 顶部导航栏 (Header)
* **CSS Class:** `.header-bar`
* **Figma ID:** `Rectangle 1`
* **视觉特征:** 与页面 1 相同的浅紫色导航条
* **业务逻辑:** 保持全局导航一致性

#### 2.1 导航栏子元素（同页面 1）
* `Rectangle 2`: Logo 图标
* `Rectangle 3`: 导航标签背景
* `Rectangle 4`: 当前激活标签
* `Rectangle 5`: 用户操作按钮

---

### 3. 操作工具栏 (Action Toolbar)
* **CSS Class:** `.toolbar-actions`
* **Figma ID:** `Rectangle 46`
* **视觉特征:** 深蓝色 (20256D) 横条，高 81px，紧贴在 Header 下方
* **业务逻辑:** 承载页面级操作按钮（保存、预览、发布）

#### 3.1 工具栏子元素
1. **课程标题输入框:**
   * **Class:** `.toolbar-title-input`
   * **ID:** `Rectangle 57`
   * **功能:** 快速编辑课程名称（灰色 D9D9D9，宽 580px）

2. **发布按钮:**
   * **Class:** `.btn-publish`
   * **ID:** `Rectangle 58`
   * **功能:** 发布课程（紫色 8948B8，宽 128px）
   * **文本:** "Publish" (白色，24px)

3. **预览按钮:**
   * **Class:** `.btn-preview`
   * **ID:** `Rectangle 56`
   * **功能:** 预览课程效果（浅蓝色 CBD8FF，宽 128px）
   * **文本:** "Preview" (白色，24px)

4. **保存按钮:**
   * **Class:** `.btn-save`
   * **ID:** `Rectangle 55`
   * **功能:** 保存草稿（绿色 36E14A，宽 128px）
   * **文本:** "Save" (白色，24px)

---

### 4. 主布局：双栏结构

#### 4.1 左侧栏 - 章节树导航
* **CSS Class:** `.sidebar-chapter-tree`
* **Figma ID:** `Rectangle 45`
* **视觉特征:** 浅绿色 (AFF1C4) 背景，宽 779px
* **业务逻辑:** 显示课程章节的树形层级结构

##### 4.1.1 章节树元素
1. **一级章节节点 (First-level):**
   * **Class:** `.chapter-item-l1`
   * **ID:** `Rectangle 47`, `Rectangle 49`, `Rectangle 59`
   * **功能:** 顶层章节容器（灰色 D9D9D9，高 55px）
   * **文本:** "First-level chapter" (黑色，24px，居中)

2. **二级章节节点 (Second-level):**
   * **Class:** `.chapter-item-l2`
   * **ID:** `Rectangle 48`, `Rectangle 60`
   * **功能:** 二级嵌套章节（灰色 D9D9D9，高 58px，左缩进）
   * **文本:** "Second-level chapter" (黑色，24px，居中)

3. **三级章节节点 (Third-level):**
   * **Class:** `.chapter-item-l3`
   * **ID:** `Rectangle 61`
   * **功能:** 三级深度章节（灰色 D9D9D9，高 58px，进一步缩进）

4. **层级连接线:**
   * **Class:** `.tree-line-vertical` / `.tree-line-horizontal`
   * **ID:** `Line 1` ~ `Line 7`
   * **功能:** 视觉化章节父子关系（黑色 1px 边框线）

5. **幽灵按钮 (Ghost Button) - 底部常驻:**
   * **Class:** `.btn-ghost-add`
   * **ID:** `Rectangle 50`, `Rectangle 62`, `Rectangle 64`
   * **位置:** 位于展开的子章节列表底部
   * **视觉:** "[ + Add lesson/assignment... ]" 样式
   * **交互:** 点击后在当前列表末尾添加新节点

6. **悬停操作组 (Hover Actions) - 浮动显示:**
   * **Class:** `.chapter-hover-actions`
   * **触发:** 鼠标悬停在章节条目 (`.chapter-item`) 上时显示
   * **子元素:**
     * **添加子项:** `[+]` 按钮 - 快速添加子课时
     * **更多菜单:** `[⋮]` 按钮 - 包含重命名、删除、移动等操作
   * **视觉:** 浮动在条目右侧，保持界面整洁

---

#### 4.2 右侧栏 - 章节内容编辑区
* **CSS Class:** `.editor-content-panel`
* **Figma ID:** `Rectangle 51`
* **视觉特征:** 棕红色 (B15151) 背景，宽 949px
* **业务逻辑:** 编辑选中章节的详细内容

##### 4.2.1 编辑器子模块
1. **章节标题输入框:**
   * **Class:** `.input-chapter-title`
   * **ID:** `Rectangle 52`
   * **功能:** 编辑章节名称（蓝色 068BFF，高 93px）

2. **富文本编辑器:**
   * **Class:** `.richtext-editor`
   * **ID:** `Rectangle 53`
   * **功能:** 章节正文/图文内容编辑（粉色 D63EBB，高 259px）

3. **资源上传区域:**
   * **Class:** `.resource-upload-zone`
   * **ID:** `Rectangle 54`
   * **功能:** 上传视频/课件附件（紫色 931FDB，高 271px）

---

## 设计模式总结

### 导航流程
1. **Step 1 (Base Info):** 填写课程元信息 → 点击"下一步"
2. **Step 2 (Chapter Details):** 构建章节树 → 编辑章节内容 → 保存/发布

### 颜色语义推测
* **浅紫色 (A1A4DB):** 全局导航/固定区域
* **深蓝色 (20256D):** 功能工具栏
* **浅绿色 (AFF1C4):** 导航/树形结构区
* **棕红色 (B15151):** 内容编辑主区
* **青色 (00BFFF):** 强调输入区域
* **绿色 (36E14A):** 主要操作按钮（保存）
* **灰色 (D9D9D9):** 输入框/列表项背景

---

*本文档由 AI 根据 Figma 导出的 CSS 代码和设计原型自动生成。*
