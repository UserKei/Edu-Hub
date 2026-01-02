# 动态面包屑/标题修复方案

## 问题描述
`TopBar.vue` 组件目前硬编码显示 `{{ $t('dashboard.title') }}`，导致在导航到“课程库”或“我的课程”等页面时，标题不会随之改变。

## 解决方案

### 1. 更新路由配置
在 `src/router/index.js` 中为每个路由添加 `meta` 字段，包含对应的翻译键值 (translation key)。

**示例：**
```javascript
{
  path: '/courses',
  name: 'course-library',
  component: () => import('../views/course/CourseLibraryView.vue'),
  meta: {
    title: 'course.library.title' // 对应 locales 中的翻译键
  }
}
```

### 2. 修改 TopBar 组件
修改 `src/components/layout/TopBar.vue`，使其根据当前路由动态显示标题。

**具体改动：**
1.  引入 `useRoute` (vue-router) 和 `computed` (vue)。
2.  创建一个计算属性 `currentTitle`，优先读取 `route.meta.title`。

```javascript
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const currentTitle = computed(() => {
  // 如果路由有配置标题，则使用翻译函数显示
  if (route.meta && route.meta.title) {
    return route.meta.title // 在模板中使用 $t(currentTitle)
  }
  return 'dashboard.title' // 默认回退
})
```

3.  更新模板：
```vue
<span class="text-ctp-text font-medium">{{ $t(currentTitle) }}</span>
```

### 3. 动态路由处理 (进阶)
对于像 `/learn/:courseId` 这样的路由，如果需要显示具体的课程名称：
- **方案 A (推荐)**: 使用通用的部分标题 (如 "学习中心")，在 `router` 中配置。
- **方案 B**: 使用 Pinia Store (`appStore.pageTitle`)，让页面组件在加载数据后更新全局标题。

本方案优先实施 **方案 A**，确保导航栏显示当前所在的功能模块。

## 执行步骤
1.  编辑 `src/router/index.js`，补全所有主要路由的 `meta.title`。
2.  编辑 `src/components/layout/TopBar.vue`，实现动态标题逻辑。
