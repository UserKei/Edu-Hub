<template>
  <div class="flex items-center justify-between p-4 border-b border-ctp-surface0 bg-ctp-mantle">
    <div class="text-sm text-ctp-overlay1">
      <span v-if="lastSaved">Last saved: {{ lastSaved }}</span>
      <span v-else>Unsaved changes</span>
    </div>
    <div class="flex gap-3">
      <button
        @click="$emit('save')"
        class="px-4 py-2 rounded-lg bg-ctp-green text-ctp-base font-medium hover:bg-ctp-green/80 transition-colors"
      >
        Save
      </button>
      <button
        @click="$emit('preview')"
        class="px-4 py-2 rounded-lg border border-ctp-surface1 text-ctp-text hover:bg-ctp-surface0 transition-colors"
      >
        Preview
      </button>
      <button
        @click="$emit('publish')"
        class="px-4 py-2 rounded-lg bg-ctp-blue text-ctp-base font-medium hover:bg-ctp-blue/80 transition-colors"
      >
        Publish
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  lastSaved: String
})

defineEmits(['save', 'preview', 'publish'])
</script>
