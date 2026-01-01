<template>
  <div class="flex flex-col h-full">
    <div class="p-4 border-b border-ctp-surface0">
      <h3 class="font-bold text-ctp-text">Course Structure</h3>
    </div>

    <div class="flex-1 overflow-y-auto p-2">
      <NestedDraggable
        :list="chapters"
        :selected-id="selectedId"
        @select="$emit('select', $event)"
        @add="$emit('add', $event)"
        @delete="$emit('delete', $event)"
        @change="handleTreeChange"
      />
    </div>

    <div class="p-4 border-t border-ctp-surface0">
      <button
        @click="$emit('add', null)"
        class="w-full flex items-center justify-center gap-2 rounded-lg border-2 border-dashed border-ctp-overlay1 p-2 text-sm text-ctp-overlay1 hover:border-ctp-blue hover:text-ctp-blue transition-colors"
      >
        <span>+ Add Lesson</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import NestedDraggable from './NestedDraggable.vue'

defineProps({
  chapters: {
    type: Array,
    required: true
  },
  selectedId: [Number, String]
})

const emit = defineEmits(['select', 'add', 'delete', 'move'])

const handleTreeChange = () => {
  emit('move')
}
</script>
