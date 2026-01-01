<script setup>
import { ref, watch } from 'vue'
import { Icon } from '@iconify/vue'
import AppButton from '@/components/ui/AppButton.vue'

defineProps({
  title: {
    type: String,
    required: true
  },
  showCreateButton: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['search', 'create'])

const searchQuery = ref('')
let debounceTimer = null

watch(searchQuery, (newValue) => {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    emit('search', newValue)
  }, 500)
})
</script>

<template>
  <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
    <!-- Title & Search Label -->
    <div class="flex items-center gap-4">
      <div class="bg-black text-white px-4 py-2 rounded font-medium">
        {{ title }}
      </div>
    </div>

    <!-- Actions -->
    <div class="flex items-center gap-4 flex-1 justify-end">
      <!-- Search Input -->
      <div class="relative w-full md:w-64">
        <Icon
          icon="mdi:magnify"
          class="absolute left-3 top-1/2 -translate-y-1/2 text-ctp-subtext0 text-xl"
        />
        <input
          v-model="searchQuery"
          type="text"
          :placeholder="$t('course.action.search_placeholder')"
          class="w-full bg-ctp-surface1 text-ctp-text pl-10 pr-4 py-2 rounded-lg border border-transparent focus:border-ctp-blue focus:outline-none transition-colors"
        />
      </div>

      <!-- Create Button -->
      <AppButton
        v-if="showCreateButton"
        variant="primary"
        class="w-auto! px-4! py-2! h-auto! text-base! bg-ctp-green hover:bg-ctp-green/90 text-ctp-base"
        @click="$emit('create')"
      >
        <Icon icon="mdi:plus" class="mr-2" />
        {{ $t('course.action.create') }}
      </AppButton>
    </div>
  </div>
</template>
