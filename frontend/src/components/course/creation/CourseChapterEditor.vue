<template>
  <div class="flex h-full gap-6">
    <!-- Sidebar -->
    <aside class="w-80 bg-ctp-mantle rounded-xl overflow-hidden border border-ctp-surface0 flex flex-col">
      <ChapterTree
        :chapters="chapters"
        :selected-id="currentChapterId"
        @select="handleSelect"
        @add="handleAdd"
        @delete="handleDelete"
        @move="handleMove"
      />
    </aside>

    <!-- Main Editor -->
    <main class="flex-1 bg-ctp-mantle rounded-xl border border-ctp-surface0 flex flex-col overflow-hidden">
      <EditorToolbar
        :last-saved="lastSavedTime"
        @save="handleSave"
        @preview="handlePreview"
        @publish="handlePublish"
      />
      <div class="flex-1 overflow-y-auto p-6">
        <ChapterContentEditor
          v-if="currentChapter"
          :chapter="currentChapter"
          @update="handleUpdate"
        />
        <div v-else class="flex h-full items-center justify-center text-ctp-overlay1">
          Select a chapter to start editing
        </div>
      </div>
    </main>

    <InputModal
      v-model="newChapterTitle"
      :is-open="showAddModal"
      title="Add New Chapter"
      placeholder="Enter chapter title..."
      @close="showAddModal = false"
      @confirm="confirmAddChapter"
    />

    <ConfirmModal
      :is-open="showConfirmModal"
      :title="confirmConfig.title"
      :message="confirmConfig.message"
      @close="showConfirmModal = false"
      @confirm="handleConfirmAction"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCourseCreationStore } from '@/stores/course-creation'
import { useToast } from '@/composables/useToast'
import ChapterTree from './ChapterTree.vue'
import ChapterContentEditor from './ChapterContentEditor.vue'
import EditorToolbar from './EditorToolbar.vue'
import InputModal from '@/components/ui/InputModal.vue'
import ConfirmModal from '@/components/ui/ConfirmModal.vue'

const router = useRouter()
const store = useCourseCreationStore()
const toast = useToast()

const chapters = computed(() => store.chapters)
const currentChapterId = computed(() => store.currentChapterId)
const currentChapter = computed(() => {
  // Find chapter in tree
  const findChapter = (list, id) => {
    for (const item of list) {
      if (item.id === id) return item
      if (item.children) {
        const found = findChapter(item.children, id)
        if (found) return found
      }
    }
    return null
  }
  return findChapter(store.chapters, store.currentChapterId)
})

const lastSavedTime = ref('')
const showAddModal = ref(false)
const newChapterTitle = ref('')
const pendingParentId = ref(null)

const showConfirmModal = ref(false)
const confirmConfig = ref({
  title: '',
  message: '',
  action: null
})

const handleSelect = (id) => {
  store.currentChapterId = id
}

const handleAdd = (parentId) => {
  pendingParentId.value = parentId
  newChapterTitle.value = ''
  showAddModal.value = true
}

const confirmAddChapter = async () => {
  if (!newChapterTitle.value.trim()) {
    toast.warning('Please enter a chapter title')
    return
  }

  try {
    await store.addChapter({
      title: newChapterTitle.value,
      parent_id: pendingParentId.value,
      order: 9999
    })
    showAddModal.value = false
  } catch (error) {
    console.error(error)
    toast.error('Failed to add chapter')
  }
}

const handleDelete = (id) => {
  confirmConfig.value = {
    title: 'Delete Chapter',
    message: 'Are you sure you want to delete this chapter? This action cannot be undone.',
    action: async () => {
      await store.deleteChapter(id)
      if (store.currentChapterId === id) {
        store.currentChapterId = null
      }
      toast.success('Chapter deleted')
    }
  }
  showConfirmModal.value = true
}

const handleConfirmAction = async () => {
  if (confirmConfig.value.action) {
    try {
      await confirmConfig.value.action()
    } catch (error) {
      console.error(error)
      toast.error('Action failed')
    }
  }
  showConfirmModal.value = false
}

const handleMove = async () => {
  // Reorder logic
  // We need to flatten the tree and send { id, parent_id, order } for all items
  const flatten = (list, parentId = null) => {
    let result = []
    list.forEach((item, index) => {
      result.push({
        id: item.id,
        parent_id: parentId,
        order: index + 1
      })
      if (item.children) {
        result = result.concat(flatten(item.children, item.id))
      }
    })
    return result
  }

  const payload = flatten(store.chapters)
  await store.reorderChapters(payload)
}

const handleUpdate = async (data) => {
  // data contains updated fields (title, content)
  // Store handles debounce
  await store.updateChapter(data.id, data)
  lastSavedTime.value = new Date().toLocaleTimeString()
}

const handleSave = () => {
  if (currentChapter.value) {
      store.updateChapter(currentChapter.value.id, currentChapter.value)
      lastSavedTime.value = new Date().toLocaleTimeString()
  }
}

const handlePreview = () => {
  toast.info('Preview not implemented yet')
}

const handlePublish = () => {
  confirmConfig.value = {
    title: 'Publish Course',
    message: 'Are you sure you want to publish this course? It will be visible to students.',
    action: async () => {
      await store.publishCourse()
      toast.success('Course published!')
      router.push({ name: 'student-course-detail', params: { courseId: store.courseId } })
    }
  }
  showConfirmModal.value = true
}

onMounted(() => {
  if (store.courseId) {
    store.fetchChapters(store.courseId)
  }
})
</script>
