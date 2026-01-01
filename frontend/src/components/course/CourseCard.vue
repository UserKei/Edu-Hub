<script setup>
import { Icon } from '@iconify/vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  course: {
    type: Object,
    required: true
  },
  isEnrolled: {
    type: Boolean,
    default: false
  }
})

const router = useRouter()

const handleClick = () => {
  if (props.isEnrolled) {
    // 如果已选修，跳转到内容/学习页面
    router.push(`/learn/${props.course.course_id || props.course.id}`)
  } else {
    // 如果未选修，跳转到课程详情/介绍页面
    // TODO: Implement Course Detail/Intro page. For now, redirect to learn page if public or handle differently
    // Assuming we have a detail page at /course/:id, but currently we only have /learn/:id
    // Let's point to /learn/:id for now, assuming the view handles enrollment check or we add a detail view later.
    // Actually, the user complained about /course/2 not matching.
    // If we don't have a detail page yet, we should probably just go to /learn/ and let the backend/frontend handle access control.
    router.push(`/learn/${props.course.id}`)
  }
}
</script>

<template>
  <div
    class="group bg-ctp-surface1 hover:bg-ctp-surface2 rounded-xl overflow-hidden transition-all duration-300 cursor-pointer border border-transparent hover:border-ctp-blue/30 flex flex-col h-full"
    @click="handleClick"
  >
    <!-- Cover Image -->
    <div class="relative aspect-video bg-ctp-crust overflow-hidden">
      <img
        v-if="course.cover_image"
        :src="course.cover_image"
        :alt="course.title"
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div v-else class="w-full h-full flex items-center justify-center text-ctp-overlay1">
        <Icon icon="mdi:image-off" class="text-4xl" />
      </div>

      <!-- Type Badge -->
      <div class="absolute top-2 right-2 px-2 py-1 rounded text-xs font-medium bg-black/50 text-white backdrop-blur-sm">
        {{ course.type === 'PUBLIC' ? $t('course.type.public') : $t('course.type.private') }}
      </div>
    </div>

    <!-- Content -->
    <div class="p-4 flex flex-col flex-1 gap-2">
      <h3 class="font-bold text-lg text-ctp-text line-clamp-2 group-hover:text-ctp-blue transition-colors">
        {{ course.title }}
      </h3>

      <p class="text-sm text-ctp-subtext0 line-clamp-2 flex-1">
        {{ course.description }}
      </p>

      <!-- Footer Info -->
      <div class="mt-2 pt-3 border-t border-ctp-surface0 flex items-center justify-between text-xs text-ctp-subtext1">
        <div class="flex items-center gap-1">
          <Icon icon="mdi:clock-outline" />
          <span>{{ new Date(course.updated_at).toLocaleDateString() }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
