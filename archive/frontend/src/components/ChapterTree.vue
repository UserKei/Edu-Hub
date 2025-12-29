<template>
  <draggable
    :list="chapters"
    group="chapters"
    item-key="id"
    class="chapter-list"
    :animation="200"
  >
    <template #item="{ element }">
      <div class="chapter-node">
        <div class="node-content" @click.stop="$emit('select', element)">
          <span class="icon">{{ element.type === 'FOLDER' ? '📁' : '📄' }}</span>
          {{ element.title }}
          <button v-if="level < 3" class="btn-mini" @click.stop="addChild(element)">+</button>
        </div>

        <!-- 递归渲染子节点 -->
        <div class="children" v-if="element.children">
          <ChapterTree
            :chapters="element.children"
            :courseId="courseId"
            :level="level + 1"
            @select="$emit('select', $event)"
            @refresh="$emit('refresh')"
          />
        </div>
      </div>
    </template>
  </draggable>
</template>

<script setup>
import draggable from 'vuedraggable';
import axios from 'axios';

const props = defineProps({
  chapters: {
    type: Array,
    required: true
  },
  courseId: {
    type: Number,
    required: true
  },
  level: {
    type: Number,
    default: 1
  }
});

const emit = defineEmits(['select', 'refresh']);

const addChild = async (parent) => {
  if (props.level >= 3) {
    alert('最多只能创建3级目录');
    return;
  }

  // 检查父节点是否允许添加子节点 (前端简单校验)
  if (parent.type === 'FILE' && (parent.content || parent.video_url)) {
    if (!confirm('该章节已有内容，添加子章节将使其变为目录，内容可能无法访问。是否继续？')) {
      return;
    }
  }

  const title = prompt(`在 "${parent.title}" 下添加子章节:`);
  if (!title) return;

  try {
    await axios.post(`http://localhost:3000/api/courses/${props.courseId}/chapters`, {
      title,
      parent_id: parent.id,
      order: parent.children ? parent.children.length + 1 : 1
    });
    emit('refresh');
  } catch (error) {
    alert(error.response?.data?.message || '添加失败');
  }
};
</script>

<style scoped>
.chapter-list {
  padding-left: 10px;
}
.chapter-node {
  margin: 5px 0;
}
.node-content {
  padding: 5px;
  background: #f0f0f0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.node-content:hover {
  background: #e0e0e0;
}
.children {
  margin-left: 15px;
  border-left: 1px solid #ddd;
}
.btn-mini {
  font-size: 12px;
  padding: 2px 5px;
}
</style>
