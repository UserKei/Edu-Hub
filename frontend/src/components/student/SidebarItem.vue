<script setup>
import { computed } from 'vue'
import { Icon } from '@iconify/vue'

const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  currentChapterId: {
    type: Number,
    default: null
  },
  depth: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['select'])

const isFolder = computed(() => props.item.type === 'FOLDER')
const isActive = computed(() => props.item.id === props.currentChapterId)

const handleClick = () => {
  if (!isFolder.value) {
    emit('select', props.item.id)
  }
}
</script>

<template>
  <div class="select-none">
    <!-- Item Header -->
    <div
      class="flex items-center gap-2 py-2 px-4 cursor-pointer transition-colors"
      :class="[
        isActive ? 'bg-ctp-surface1 text-ctp-blue border-l-4 border-ctp-blue' : 'hover:bg-ctp-surface0 text-ctp-text border-l-4 border-transparent',
        depth > 0 ? 'pl-' + (4 + depth * 4) : ''
      ]"
      @click="handleClick"
    >
      <!-- Icon -->
      <Icon
        v-if="isFolder"
        icon="mdi:folder-outline"
        class="text-ctp-overlay2"
      />
      <Icon
        v-else
        :icon="isActive ? 'mdi:play-circle' : 'mdi:play-circle-outline'"
        :class="isActive ? 'text-ctp-blue' : 'text-ctp-overlay2'"
      />

      <!-- Title -->
      <span class="text-sm font-medium truncate">{{ item.title }}</span>
    </div>

    <!-- Children (Recursive) -->
    <div v-if="isFolder && item.children && item.children.length">
      <SidebarItem
        v-for="child in item.children"
        :key="child.id"
        :item="child"
        :current-chapter-id="currentChapterId"
        :depth="depth + 1"
        @select="$emit('select', $event)"
      />
    </div>
  </div>
</template>
