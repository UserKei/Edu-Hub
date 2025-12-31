# 前端颜色开发规范 (Catppuccin Palette)

本项目前端采用 **Catppuccin** 配色方案，并通过 `@catppuccin/tailwindcss` 库集成到 Tailwind CSS (v4) 中。

## 1. 集成方式

本项目使用 Tailwind CSS v4 的 CSS 导入方式集成 Catppuccin 主题。

### 1.1 安装依赖

```bash
npm install -D @catppuccin/tailwindcss
```

### 1.2 引入主题

在项目的 CSS 入口文件（如 `src/assets/main.css`）中引入主题文件。
**推荐引入 `mocha.css`**，这将使 **Mocha (深色模式)** 成为默认主题，同时包含其他主题（Latte, Frappe, Macchiato）的定义。

```css
@import "tailwindcss";
@import "@catppuccin/tailwindcss/mocha.css";
```

## 2. 使用规范

### 2.1 颜色类名

所有颜色类名均以 `ctp-` 开头。

*   **基础用法**: `bg-ctp-{colorName}`, `text-ctp-{colorName}`, `border-ctp-{colorName}`
*   **带透明度**: `bg-ctp-{colorName}/50`
*   **色阶 (Shades)**: `bg-ctp-{colorName}-{50-950}` (例如 `bg-ctp-blue-500`)

**示例**:
```html
<div class="bg-ctp-base text-ctp-text border-ctp-surface0">
  <button class="bg-ctp-blue text-ctp-base hover:bg-ctp-blue/80">
    Click Me
  </button>
</div>
```

### 2.2 主题切换与变体

该库内置了所有四个主题（Latte, Frappe, Macchiato, Mocha）的 CSS 变量定义和变体。

*   **默认主题**: 由引入的 CSS 文件决定（如引入 `mocha.css` 则默认为 Mocha）。
*   **切换主题**: 在父容器（通常是 `<body>` 或 `<html>`）添加对应类名：`.latte`, `.frappe`, `.macchiato`, `.mocha`。
    ```html
    <!-- 强制使用 Latte 主题 -->
    <div class="latte bg-ctp-base text-ctp-text">
      此区域将显示为浅色模式 (Latte)
    </div>
    ```
*   **主题变体**: 使用 `latte:`, `frappe:`, `macchiato:`, `mocha:` 前缀来为特定主题编写样式。
    ```html
    <div class="bg-ctp-base mocha:bg-ctp-mantle latte:bg-ctp-surface0">
      不同主题下背景不同
    </div>
    ```

## 3. 语义化配色指南

为了保持 UI 一致性，请遵循以下语义化配色建议。

### 3.1 页面层级 (Surfaces)

| 颜色名称 | Tailwind 类名 | 语义/用途 |
| :--- | :--- | :--- |
| **Base** | `ctp-base` | **默认背景**。应用的主背景色。 |
| **Mantle** | `ctp-mantle` | **层级 1 背景**。侧边栏、导航栏、卡片背景。位于 Base 之上。 |
| **Crust** | `ctp-crust` | **层级 2 背景**。页脚、底栏、深层区域。位于 Mantle 之上或之下。 |
| **Surface0** | `ctp-surface0` | **容器/卡片**。较低层级的卡片、按钮背景（未激活）。 |
| **Surface1** | `ctp-surface1` | **容器/卡片**。标准卡片背景、输入框背景。 |
| **Surface2** | `ctp-surface2` | **容器/卡片**。较高层级的卡片、悬停状态 (Hover) 背景。 |

### 3.2 文本与内容 (Text)

| 颜色名称 | Tailwind 类名 | 语义/用途 |
| :--- | :--- | :--- |
| **Text** | `ctp-text` | **主要文本**。标题、正文。 |
| **Subtext1** | `ctp-subtext1` | **次要文本**。副标题、说明文字。 |
| **Subtext0** | `ctp-subtext0` | **辅助文本**。较浅的说明文字。 |
| **Overlay2** | `ctp-overlay2` | **微弱文本/边框**。表单边框、次要文字。 |
| **Overlay1** | `ctp-overlay1` | **装饰性元素**。分割线、禁用状态文字。 |
| **Overlay0** | `ctp-overlay0` | **装饰性元素**。极淡的分割线、背景纹理。 |

### 3.3 功能色 (Accents)

| 颜色名称 | Tailwind 类名 | 语义/用途 |
| :--- | :--- | :--- |
| **Blue** | `ctp-blue` | **主色调 (Primary)**。主要操作、链接、Logo。 |
| **Mauve** | `ctp-mauve` | **辅色调 (Secondary)**。次要按钮、高亮标签。 |
| **Red** | `ctp-red` | **错误 (Error)**。错误提示、删除操作。 |
| **Peach** | `ctp-peach` | **警告 (Warning)**。警告提示。 |
| **Yellow** | `ctp-yellow` | **注意 (Notice)**。提示信息、评分。 |
| **Green** | `ctp-green` | **成功 (Success)**。成功提示、完成状态。 |
| **Lavender** | `ctp-lavender` | **辅助强调**。选中状态、聚焦环。 |

## 4. 颜色参考 (Latte Hex Codes)

仅供参考，开发时请务必使用 `ctp-` 类名。

### 4.1 基础颜色 (Base Colors)

*   **Rosewater**: `#dc8a78`
*   **Flamingo**: `#dd7878`
*   **Pink**: `#ea76cb`
*   **Mauve**: `#8839ef`
*   **Red**: `#d20f39`
*   **Maroon**: `#e64553`
*   **Peach**: `#fe640b`
*   **Yellow**: `#df8e1d`
*   **Green**: `#40a02b`
*   **Teal**: `#179299`
*   **Sky**: `#04a5e5`
*   **Sapphire**: `#209fb5`
*   **Blue**: `#1e66f5`
*   **Lavender**: `#7287fd`
*   **Text**: `#4c4f69`
*   **Subtext1**: `#5c5f77`
*   **Subtext0**: `#6c6f85`
*   **Overlay2**: `#7c7f93`
*   **Overlay1**: `#8c8fa1`
*   **Overlay0**: `#9ca0b0`
*   **Surface2**: `#acb0be`
*   **Surface1**: `#bcc0cc`
*   **Surface0**: `#ccd0da`
*   **Base**: `#eff1f5`
*   **Mantle**: `#e6e9ef`
*   **Crust**: `#dce0e8`

### 4.2 完整色阶 (Full Palette with Shades)

以下是 Latte 主题下所有可用颜色的 Hex 值。

#### Rosewater
*   `ctp-rosewater`: `#dc8a78`
*   `ctp-rosewater-50`: `#e6c6c4`
*   `ctp-rosewater-100`: `#e4bcb8`
*   `ctp-rosewater-200`: `#e2b1ab`
*   `ctp-rosewater-300`: `#e0a69c`
*   `ctp-rosewater-400`: `#de998c`
*   `ctp-rosewater-500`: `#dc8a78`
*   `ctp-rosewater-600`: `#d28372`
*   `ctp-rosewater-700`: `#c27969`
*   `ctp-rosewater-800`: `#af6d5e`
*   `ctp-rosewater-900`: `#9a5f52`
*   `ctp-rosewater-950`: `#804e43`

#### Flamingo
*   `ctp-flamingo`: `#dd7878`
*   `ctp-flamingo-50`: `#e6c1c4`
*   `ctp-flamingo-100`: `#e4b5b8`
*   `ctp-flamingo-200`: `#e3a9ab`
*   `ctp-flamingo-300`: `#e19b9c`
*   `ctp-flamingo-400`: `#df8b8c`
*   `ctp-flamingo-500`: `#dd7878`
*   `ctp-flamingo-600`: `#d37272`
*   `ctp-flamingo-700`: `#c26969`
*   `ctp-flamingo-800`: `#b05e5e`
*   `ctp-flamingo-900`: `#9a5252`
*   `ctp-flamingo-950`: `#804343`

#### Pink
*   `ctp-pink`: `#ea76cb`
*   `ctp-pink-50`: `#edc1e1`
*   `ctp-pink-100`: `#ecb5dd`
*   `ctp-pink-200`: `#eca8d9`
*   `ctp-pink-300`: `#eb9ad4`
*   `ctp-pink-400`: `#eb89d0`
*   `ctp-pink-500`: `#ea76cb`
*   `ctp-pink-600`: `#df70c2`
*   `ctp-pink-700`: `#ce67b2`
*   `ctp-pink-800`: `#ba5da1`
*   `ctp-pink-900`: `#a4518e`
*   `ctp-pink-950`: `#884275`

#### Mauve
*   `ctp-mauve`: `#8839ef`
*   `ctp-mauve-50`: `#c4b5f2`
*   `ctp-mauve-100`: `#baa5f1`
*   `ctp-mauve-200`: `#af93f1`
*   `ctp-mauve-300`: `#a47ef0`
*   `ctp-mauve-400`: `#9763f0`
*   `ctp-mauve-500`: `#8839ef`
*   `ctp-mauve-600`: `#8236e4`
*   `ctp-mauve-700`: `#7731d2`
*   `ctp-mauve-800`: `#6b2bbe`
*   `ctp-mauve-900`: `#5e25a7`
*   `ctp-mauve-950`: `#4d1d8b`

#### Red
*   `ctp-red`: `#d20f39`
*   `ctp-red-50`: `#e1b1b8`
*   `ctp-red-100`: `#dea1a8`
*   `ctp-red-200`: `#db8d95`
*   `ctp-red-300`: `#d87680`
*   `ctp-red-400`: `#d55664`
*   `ctp-red-500`: `#d20f39`
*   `ctp-red-600`: `#c80e36`
*   `ctp-red-700`: `#b90c31`
*   `ctp-red-800`: `#a7092b`
*   `ctp-red-900`: `#930725`
*   `ctp-red-950`: `#7a051d`

#### Maroon
*   `ctp-maroon`: `#e64553`
*   `ctp-maroon-50`: `#ebb6bb`
*   `ctp-maroon-100`: `#eaa7ad`
*   `ctp-maroon-200`: `#e9969c`
*   `ctp-maroon-300`: `#e88289`
*   `ctp-maroon-400`: `#e76972`
*   `ctp-maroon-500`: `#e64553`
*   `ctp-maroon-600`: `#dc414f`
*   `ctp-maroon-700`: `#ca3c48`
*   `ctp-maroon-800`: `#b73540`
*   `ctp-maroon-900`: `#a12e38`
*   `ctp-maroon-950`: `#86242d`

#### Peach
*   `ctp-peach`: `#fe640b`
*   `ctp-peach-50`: `#f7bcb4`
*   `ctp-peach-100`: `#f8afa3`
*   `ctp-peach-200`: `#faa08f`
*   `ctp-peach-300`: `#fb9077`
*   `ctp-peach-400`: `#fd7c57`
*   `ctp-peach-500`: `#fe640b`
*   `ctp-peach-600`: `#f25f0a`
*   `ctp-peach-700`: `#e05708`
*   `ctp-peach-800`: `#cb4e07`
*   `ctp-peach-900`: `#b24405`
*   `ctp-peach-950`: `#943703`

#### Yellow
*   `ctp-yellow`: `#df8e1d`
*   `ctp-yellow-50`: `#e7c8b5`
*   `ctp-yellow-100`: `#e6bea4`
*   `ctp-yellow-200`: `#e4b391`
*   `ctp-yellow-300`: `#e2a879`
*   `ctp-yellow-400`: `#e19c5a`
*   `ctp-yellow-500`: `#df8e1d`
*   `ctp-yellow-600`: `#d5871b`
*   `ctp-yellow-700`: `#c47c18`
*   `ctp-yellow-800`: `#b27015`
*   `ctp-yellow-900`: `#9c6211`
*   `ctp-yellow-950`: `#82500c`

#### Green
*   `ctp-green`: `#40a02b`
*   `ctp-green-50`: `#b4ceb6`
*   `ctp-green-100`: `#a5c6a6`
*   `ctp-green-200`: `#94bd93`
*   `ctp-green-300`: `#7fb47c`
*   `ctp-green-400`: `#66aa5e`
*   `ctp-green-500`: `#40a02b`
*   `ctp-green-600`: `#3d9929`
*   `ctp-green-700`: `#378c25`
*   `ctp-green-800`: `#317f20`
*   `ctp-green-900`: `#2a6f1b`
*   `ctp-green-950`: `#215b15`

#### Teal
*   `ctp-teal`: `#179299`
*   `ctp-teal-50`: `#b0c9ce`
*   `ctp-teal-100`: `#a0c0c5`
*   `ctp-teal-200`: `#8db6bb`
*   `ctp-teal-300`: `#75abb1`
*   `ctp-teal-400`: `#569fa5`
*   `ctp-teal-500`: `#179299`
*   `ctp-teal-600`: `#158b92`
*   `ctp-teal-700`: `#138086`
*   `ctp-teal-800`: `#107379`
*   `ctp-teal-900`: `#0d656a`
*   `ctp-teal-950`: `#085357`

#### Sky
*   `ctp-sky`: `#04a5e5`
*   `ctp-sky-50`: `#b0d0ed`
*   `ctp-sky-100`: `#9fc8ec`
*   `ctp-sky-200`: `#8bc0ea`
*   `ctp-sky-300`: `#74b8e8`
*   `ctp-sky-400`: `#53afe7`
*   `ctp-sky-500`: `#04a5e5`
*   `ctp-sky-600`: `#049ddb`
*   `ctp-sky-700`: `#0391ca`
*   `ctp-sky-800`: `#0283b6`
*   `ctp-sky-900`: `#0272a0`
*   `ctp-sky-950`: `#015e85`

#### Sapphire
*   `ctp-sapphire`: `#209fb5`
*   `ctp-sapphire-50`: `#b1cdd8`
*   `ctp-sapphire-100`: `#a0c5d2`
*   `ctp-sapphire-200`: `#8ebdcb`
*   `ctp-sapphire-300`: `#77b3c4`
*   `ctp-sapphire-400`: `#59aabd`
*   `ctp-sapphire-500`: `#209fb5`
*   `ctp-sapphire-600`: `#1e98ad`
*   `ctp-sapphire-700`: `#1b8b9f`
*   `ctp-sapphire-800`: `#177e90`
*   `ctp-sapphire-900`: `#136e7e`
*   `ctp-sapphire-950`: `#0e5b68`

#### Blue
*   `ctp-blue`: `#1e66f5`
*   `ctp-blue-50`: `#b1bdf5`
*   `ctp-blue-100`: `#a0b0f5`
*   `ctp-blue-200`: `#8da1f5`
*   `ctp-blue-300`: `#7791f5`
*   `ctp-blue-400`: `#587ef5`
*   `ctp-blue-500`: `#1e66f5`
*   `ctp-blue-600`: `#1c61ea`
*   `ctp-blue-700`: `#1959d8`
*   `ctp-blue-800`: `#1650c3`
*   `ctp-blue-900`: `#1245ac`
*   `ctp-blue-950`: `#0d388f`

#### Lavender
*   `ctp-lavender`: `#7287fd`
*   `ctp-lavender-50`: `#bec5f9`
*   `ctp-lavender-100`: `#b2bbfa`
*   `ctp-lavender-200`: `#a5b0fb`
*   `ctp-lavender-300`: `#97a4fb`
*   `ctp-lavender-400`: `#8696fc`
*   `ctp-lavender-500`: `#7287fd`
*   `ctp-lavender-600`: `#6d81f2`
*   `ctp-lavender-700`: `#6476df`
*   `ctp-lavender-800`: `#596aca`
*   `ctp-lavender-900`: `#4e5db1`
*   `ctp-lavender-950`: `#3f4c94`
