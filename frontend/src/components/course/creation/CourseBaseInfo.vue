<template>
  <div class="space-y-6">
    <!-- Course Name -->
    <div class="space-y-2">
      <label class="block text-sm font-medium text-ctp-subtext0">Course Name</label>
      <input
        v-model="formData.title"
        type="text"
        class="w-full rounded-lg bg-ctp-surface0 border border-ctp-surface1 p-3 text-ctp-text focus:border-ctp-blue focus:outline-none"
        placeholder="e.g. Full Stack Development 2025"
      />
    </div>

    <!-- Description -->
    <div class="space-y-2">
      <label class="block text-sm font-medium text-ctp-subtext0">Description</label>
      <textarea
        v-model="formData.description"
        rows="4"
        class="w-full rounded-lg bg-ctp-surface0 border border-ctp-surface1 p-3 text-ctp-text focus:border-ctp-blue focus:outline-none"
        placeholder="What will students learn?"
      ></textarea>
    </div>

    <!-- Visibility -->
    <div class="space-y-2">
      <label class="block text-sm font-medium text-ctp-subtext0">Visibility</label>
      <select
        v-model="formData.type"
        class="w-full rounded-lg bg-ctp-surface0 border border-ctp-surface1 p-3 text-ctp-text focus:border-ctp-blue focus:outline-none"
      >
        <option value="PUBLIC">Public</option>
        <option value="PRIVATE">Private</option>
      </select>
    </div>

    <!-- Cover Image (Mock Upload) -->
    <div class="space-y-2">
      <label class="block text-sm font-medium text-ctp-subtext0">Cover Image</label>
      <div
        class="relative flex h-48 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-ctp-surface1 bg-ctp-surface0 hover:border-ctp-blue transition-colors"
        @click="handleMockUpload"
      >
        <div v-if="isUploading" class="text-ctp-blue animate-pulse">Uploading...</div>
        <img
          v-else-if="formData.cover_image"
          :src="formData.cover_image"
          class="h-full w-full object-cover rounded-lg"
        />
        <div v-else class="text-center text-ctp-overlay1">
          <p>Click to upload cover image</p>
          <p class="text-xs mt-1">(Mock: Returns dummy URL)</p>
        </div>
      </div>
    </div>

    <!-- Action -->
    <div class="flex justify-end pt-4">
      <button
        @click="submit"
        class="rounded-lg bg-ctp-blue px-6 py-2 font-medium text-ctp-base hover:bg-ctp-blue/80 transition-colors"
      >
        Next Step
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useToast } from '@/composables/useToast'

const props = defineProps({
  initialData: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['submit'])
const toast = useToast()

const formData = ref({
  title: '',
  description: '',
  type: 'PUBLIC',
  cover_image: ''
})

const isUploading = ref(false)

watch(() => props.initialData, (newVal) => {
  if (newVal && Object.keys(newVal).length > 0) {
    formData.value = { ...formData.value, ...newVal }
  }
}, { immediate: true, deep: true })

const handleMockUpload = () => {
  if (isUploading.value) return
  isUploading.value = true

  // Simulate 1.5s delay
  setTimeout(() => {
    formData.value.cover_image = 'https://placehold.co/600x400'
    isUploading.value = false
  }, 1500)
}

const submit = () => {
  if (!formData.value.title) {
    toast.warning('Please enter a course title')
    return
  }
  emit('submit', formData.value)
}
</script>
