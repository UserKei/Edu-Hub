## Course Library Page

### 1. Global Header
* **CSS Class:** `.header-container`
* **Figma ID:** `Rectangle 1`
* **视觉特征:** 顶部通栏紫色背景 (#A1A4DB)，高度 137px，占据页面顶部。
* **业务逻辑:** 全局导航栏，包含 Logo、全局搜索入口和用户信息/设置入口。

#### 1.1 Header Elements
1.  **Logo Container:**
    *   **Class:** `.logo-box`
    *   **ID:** `Rectangle 2`
    *   **功能:** 应用 Logo 容器，点击通常返回首页。
2.  **Global Search Input:**
    *   **Class:** `.global-search-input`
    *   **ID:** `Rectangle 3`
    *   **功能:** 顶部全局搜索框的背景容器。
3.  **Global Search Button:**
    *   **Class:** `.global-search-btn`
    *   **ID:** `Rectangle 4`
    *   **功能:** 触发全局搜索的按钮图标背景。
4.  **User Profile/Avatar:**
    *   **Class:** `.user-profile`
    *   **ID:** `Rectangle 5`
    *   **功能:** 用户头像容器，点击展开个人菜单。

### 2. Sidebar Navigation
* **CSS Class:** `.sidebar-wrapper`
* **Figma ID:** `Rectangle 6`
* **视觉特征:** 左侧深蓝色背景 (#324E88)，高度 980px，固定在左侧。
* **业务逻辑:** 侧边栏导航菜单，用于在不同功能模块间切换。

#### 2.1 Navigation Items
1.  **Nav Item: Course Library:**
    *   **Class:** `.nav-item.library`
    *   **ID:** `Rectangle 21`
    *   **功能:** “课程库”菜单项背景，点击跳转至课程库页面。
2.  **Nav Item: My Courses:**
    *   **Class:** `.nav-item.my-courses`
    *   **ID:** `Rectangle 22`
    *   **功能:** “我的课程”菜单项背景，点击跳转至我的课程页面。

### 3. Main Content Area
* **CSS Class:** `.main-content`
* **Figma ID:** N/A (Implicit area defined by content elements)
* **视觉特征:** 侧边栏右侧的白色背景区域。
* **业务逻辑:** 页面主要内容展示区，包含操作栏和课程列表。

#### 3.1 Action Bar
1.  **Search Label/Indicator:**
    *   **Class:** `.action-label-search`
    *   **ID:** `Rectangle 29`
    *   **功能:** 标识当前为搜索/筛选区域，或作为搜索功能的标题背景。
2.  **New Course Button:**
    *   **Class:** `.btn-create-course`
    *   **ID:** `Rectangle 30`
    *   **功能:** “新建课程”按钮背景（绿色 #53C74B），仅教师角色可见，用于创建新课程。

#### 3.2 Search Filter Area
1.  **Search Input Field:**
    *   **Class:** `.page-search-input`
    *   **ID:** `Rectangle 23`
    *   **功能:** 页面级搜索框背景（灰色 #D9D9D9），用于输入关键字过滤下方课程列表。

#### 3.3 Course List Container
* **CSS Class:** `.course-list-container`
* **Figma ID:** `Rectangle 24`
* **视觉特征:** 深灰色背景 (#757A85) 的大区域，位于搜索框下方。
* **业务逻辑:** 课程卡片的滚动容器，承载所有课程数据。

#### 3.4 Course Cards
1.  **Course Card 1:**
    *   **Class:** `.course-card`
    *   **ID:** `Rectangle 25`
    *   **功能:** 列表中的第一个课程卡片容器，展示课程封面及信息。
2.  **Course Card 2:**
    *   **Class:** `.course-card`
    *   **ID:** `Rectangle 26`
    *   **功能:** 列表中的第二个课程卡片容器。
3.  **Course Card 3:**
    *   **Class:** `.course-card`
    *   **ID:** `Rectangle 27`
    *   **功能:** 列表中的第三个课程卡片容器。

---

## My Courses Page

### 1. Global Header & Sidebar
* **说明:** 头部与侧边栏结构与“Course Library Page”完全一致，复用相同的 ID 和布局。
* **差异:** 在交互状态上，`Rectangle 22` (My Courses) 应处于激活/高亮状态。

### 2. Main Content Area
* **说明:** 主内容区域结构与“Course Library Page”一致。

#### 2.1 Action Bar
1.  **Search Label/Indicator:**
    *   **Class:** `.action-label-search`
    *   **ID:** `Rectangle 29`
    *   **功能:** 搜索区域标识。
2.  **New Course Button:**
    *   **Class:** `.btn-create-course`
    *   **ID:** `Rectangle 30`
    *   **功能:** 新建课程按钮。

#### 2.2 Search Filter Area
1.  **Search Input Field:**
    *   **Class:** `.page-search-input`
    *   **ID:** `Rectangle 23`
    *   **功能:** 搜索框背景。

#### 2.3 Course List Container
*   **Class:** `.course-list-container`
*   **ID:** `Rectangle 24`
*   **功能:** 课程列表容器。

#### 2.4 Course Cards
1.  **Course Card 1:**
    *   **Class:** `.course-card`
    *   **ID:** `Rectangle 25`
    *   **功能:** 课程卡片。
2.  **Course Card 2:**
    *   **Class:** `.course-card`
    *   **ID:** `Rectangle 26`
    *   **功能:** 课程卡片。
3.  **Course Card 3:**
    *   **Class:** `.course-card`
    *   **ID:** `Rectangle 27`
    *   **功能:** 课程卡片。
