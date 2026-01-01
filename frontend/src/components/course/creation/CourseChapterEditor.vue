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
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useCourseCreationStore } from '@/stores/course-creation'
import ChapterTree from './ChapterTree.vue'
import ChapterContentEditor from './ChapterContentEditor.vue'
import EditorToolbar from './EditorToolbar.vue'

const store = useCourseCreationStore()

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

const handleSelect = (id) => {
  store.currentChapterId = id
}

const handleAdd = async (parentId) => {
  const title = prompt('Enter chapter title:')
  if (!title) return

  // Calculate order (append to end)
  await store.addChapter({
    title,
    parent_id: parentId,
    order: 9999 // Append to end
  })
}

const handleDelete = async (id) => {
  if (confirm('Are you sure you want to delete this chapter?')) {
    await store.deleteChapter(id)
    if (store.currentChapterId === id) {
      store.currentChapterId = null
    }
  }
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
  alert('Preview not implemented yet')
}

const handlePublish = async () => {
  if (confirm('Publish this course?')) {
    await store.publishCourse()
    alert('Course published!')
  }
}

onMounted(() => {
  if (store.courseId) {
    store.fetchChapters(store.courseId)
  }
})
</script>
