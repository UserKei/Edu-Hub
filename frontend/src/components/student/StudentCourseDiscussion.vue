<script setup>
import { ref } from 'vue'
import { Icon } from '@iconify/vue'

// Placeholder for discussion functionality
// This will be implemented fully in the Forum System phase
const comments = ref([])
const newComment = ref('')

const submitComment = () => {
  if (!newComment.value.trim()) return

  comments.value.unshift({
    id: Date.now(),
    user: 'Current User',
    content: newComment.value,
    date: new Date().toLocaleDateString()
  })
  newComment.value = ''
}
</script>

<template>
  <div class="h-full flex flex-col bg-ctp-mantle border-l border-ctp-surface0">
    <div class="p-4 border-b border-ctp-surface0">
      <h3 class="font-bold text-ctp-text">{{ $t('student.course.discussion.title') }}</h3>
    </div>

    <div class="flex-1 overflow-y-auto p-4 space-y-4">
      <div v-if="comments.length === 0" class="text-center text-ctp-subtext0 py-8">
        {{ $t('student.course.discussion.no_comments') }}
      </div>

      <div v-for="comment in comments" :key="comment.id" class="bg-ctp-surface0 p-3 rounded-lg">
        <div class="flex justify-between items-start mb-2">
          <span class="font-medium text-sm text-ctp-blue">{{ comment.user }}</span>
          <span class="text-xs text-ctp-subtext0">{{ comment.date }}</span>
        </div>
        <p class="text-sm text-ctp-text">{{ comment.content }}</p>
      </div>
    </div>

    <div class="p-4 border-t border-ctp-surface0">
      <div class="relative">
        <textarea
          v-model="newComment"
          class="w-full bg-ctp-surface0 text-ctp-text rounded-lg p-3 pr-10 resize-none focus:outline-none focus:ring-2 focus:ring-ctp-blue"
          rows="3"
          :placeholder="$t('student.course.discussion.placeholder')"
        ></textarea>
        <button
          class="absolute bottom-3 right-3 text-ctp-blue hover:text-ctp-blue/80"
          @click="submitComment"
        >
          <Icon icon="mdi:send" />
        </button>
      </div>
    </div>
  </div>
</template>
