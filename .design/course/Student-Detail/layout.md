## Course Detail Page (Student View)

### 1. Top Navigation Bar (Global Header)
* **CSS Class:** `.top-nav`
* **Figma ID:** `Rectangle 1`
* **视觉特征:** 顶部通栏紫色背景 (#A1A4DB)，高度 137px。
* **业务逻辑:** 全局导航栏，包含 Logo、搜索、用户信息等。

#### 1.1 内部子元素
1.  **Logo / Menu Icon:**
    * **ID:** `Rectangle 2`
    * **视觉:** 左侧黑色方块 (#000000)。
    * **功能:** 网站 Logo 或侧边栏折叠按钮。
2.  **Search / Action Group:**
    * **ID:** `Rectangle 3` (浅蓝 #B6FFEE) & `Rectangle 4` (深蓝 #4400FF)。
    * **视觉:** 位于 Logo 右侧的组合控件。
    * **功能:** 课程搜索框或主要功能入口。
3.  **User Profile:**
    * **ID:** `Rectangle 5`
    * **视觉:** 右侧黄绿色方块 (#CDF80C)。
    * **功能:** 用户头像，点击展开个人菜单。

---

### 2. Left Sidebar (Course Outline)
* **CSS Class:** `.chapter-sidebar`
* **Figma ID:** `Rectangle 32`
* **视觉特征:** 左侧粉色背景 (#E891C7)，宽度 281px，占据主高度。
* **业务逻辑:** 课程章节目录树，用于切换当前学习的章节内容。

#### 2.1 内部子元素
1.  **Chapter List Items:**
    * **ID:** `Rectangle 59`, `Rectangle 60`, `Rectangle 61`, `Rectangle 62`, `Rectangle 63`
    * **视觉:** 灰色条状块 (#D9D9D9)，垂直排列。
    * **功能:** 单个章节入口 (Chapter Card)，点击切换中间内容区。

---

### 3. Main Content Area (Learning View)
* **CSS Class:** `.learning-container`
* **Figma ID:** `Rectangle 31`
* **视觉特征:** 中间绿色背景 (#6C9F6C)，占据最大面积 (1153px 宽)。
* **业务逻辑:** 核心学习区域，用于播放视频或显示图文教程。

---

### 4. Right Sidebar (Discussion Panel)
* **CSS Class:** `.discussion-sidebar`
* **Figma ID:** `Rectangle 33`
* **视觉特征:** 右侧黑色背景 (#020202)，宽度 294px。
* **业务逻辑:** 课程讨论区/评论区，显示当前章节的相关讨论。

#### 4.1 内部子元素
1.  **Comment Cards:**
    * **ID:** `Rectangle 34`, `Rectangle 35`, `Rectangle 36`, `Rectangle 37`
    * **视觉:** 灰色卡片 (#D9D9D9)，垂直排列。
    * **功能:** 展示学生或老师的评论内容。
2.  **Comment Input Trigger:**
    * **ID:** (Text Only: "Comment input")
    * **视觉:** 底部区域。
    * **功能:** 点击唤起评论输入框。

---

## Comment Input Modal (Overlay State)

### 5. Modal Overlay
* **CSS Class:** `.modal-overlay`
* **Figma ID:** `Rectangle 38`
* **视觉特征:** 全屏灰色半透明遮罩 (#D9D9D9, opacity 0.5)。
* **业务逻辑:** 模态框背景，阻断底部页面交互。

### 6. Comment Dialog
* **CSS Class:** `.comment-dialog`
* **Figma ID:** `Rectangle 39`
* **视觉特征:** 居中蓝色大卡片 (#0325FF)。
* **业务逻辑:** 评论输入窗口，支持 Markdown 编辑。

#### 6.1 内部子元素
1.  **Input Area:**
    * **ID:** (Text: "Comment input Detail Markdown")
    * **视觉:** 居中文字区域。
    * **功能:** Markdown 编辑器区域。
2.  **Cancel Button:**
    * **ID:** `Rectangle 64`
    * **视觉:** 左下灰色按钮 (#D9D9D9)。
    * **功能:** 取消评论并关闭弹窗。
3.  **Publish Button:**
    * **ID:** `Rectangle 65`
    * **视觉:** 右下灰色按钮 (#D9D9D9)。
    * **功能:** 提交评论内容。
