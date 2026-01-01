<template>
  <div class="space-y-6" v-if="chapter">
    <!-- Title -->
    <div class="space-y-2">
      <label class="block text-sm font-medium text-ctp-subtext0">Chapter Title</label>
      <input
        v-model="localChapter.title"
        @input="emitUpdate"
        type="text"
        class="w-full rounded-lg bg-ctp-surface0 border border-ctp-surface1 p-3 text-ctp-text focus:border-ctp-blue focus:outline-none"
      />
    </div>

    <!-- Rich Text Editor -->
    <div class="space-y-2">
      <label class="block text-sm font-medium text-ctp-subtext0">Content</label>
      <div class="rounded-lg border border-ctp-surface1 bg-ctp-surface0 overflow-hidden">
        <!-- Toolbar -->
        <div class="flex gap-2 p-2 border-b border-ctp-surface1 bg-ctp-mantle" v-if="editor">
          <button @click="editor.chain().focus().toggleBold().run()" :class="{ 'text-ctp-blue bg-ctp-surface1': editor.isActive('bold') }" class="p-1 hover:bg-ctp-surface1 rounded text-ctp-text font-bold">B</button>
          <button @click="editor.chain().focus().toggleItalic().run()" :class="{ 'text-ctp-blue bg-ctp-surface1': editor.isActive('italic') }" class="p-1 hover:bg-ctp-surface1 rounded text-ctp-text italic">I</button>
          <button @click="editor.chain().focus().toggleHeading({ level: 2 }).run()" :class="{ 'text-ctp-blue bg-ctp-surface1': editor.isActive('heading', { level: 2 }) }" class="p-1 hover:bg-ctp-surface1 rounded text-ctp-text font-bold">H2</button>
          <button @click="editor.chain().focus().toggleBulletList().run()" :class="{ 'text-ctp-blue bg-ctp-surface1': editor.isActive('bulletList') }" class="p-1 hover:bg-ctp-surface1 rounded text-ctp-text">• List</button>
          <button @click="editor.chain().focus().toggleOrderedList().run()" :class="{ 'text-ctp-blue bg-ctp-surface1': editor.isActive('orderedList') }" class="p-1 hover:bg-ctp-surface1 rounded text-ctp-text">1. List</button>
        </div>

        <!-- Editor Content -->
        <editor-content :editor="editor" class="p-4 min-h-75 text-ctp-text" />
      </div>
    </div>

    <!-- Video Upload Section -->
    <div class="space-y-2">
      <label class="block text-sm font-medium text-ctp-subtext0">Video Lesson</label>

      <!-- Upload Area -->
      <div
        class="relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-ctp-surface1 bg-ctp-surface0 p-6 transition-colors hover:border-ctp-blue"
        :class="{ 'border-ctp-blue bg-ctp-surface1': isDragOver }"
        @dragover.prevent="isDragOver = true"
        @dragleave.prevent="isDragOver = false"
        @drop.prevent="handleDrop"
      >
        <!-- Loading State -->
        <div v-if="isUploading" class="text-ctp-blue animate-pulse">
          Uploading video...
        </div>

        <!-- Preview State (Has Video) -->
        <div v-else-if="localChapter.video_url" class="w-full">
          <video controls :src="localChapter.video_url" class="w-full rounded-lg max-h-75 bg-black"></video>
          <div class="mt-2 flex justify-end">
            <button @click="triggerFileInput" class="text-sm text-ctp-blue hover:underline">Replace Video</button>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center cursor-pointer" @click="triggerFileInput">
          <div class="text-ctp-overlay1">
            <p class="font-medium">Click to upload video</p>
            <p class="text-xs mt-1">MP4, WebM (Max 500MB)</p>
          </div>
        </div>

        <!-- Hidden Input -->
        <input
          ref="fileInput"
          type="file"
          accept="video/*"
          class="hidden"
          @change="handleFileSelect"
        />
      </div>
    </div>

    <!-- Resources (Mock) -->
    <div class="space-y-2">
      <label class="block text-sm font-medium text-ctp-subtext0">Resources</label>
      <div class="rounded-lg border border-dashed border-ctp-surface1 p-4 text-center text-ctp-overlay1">
        Resource upload coming soon...
      </div>
    </div>
  </div>
  <div v-else class="flex h-full items-center justify-center text-ctp-overlay1">
    Select a chapter to edit
  </div>
</template>

<script setup>
import { ref, watch, onBeforeUnmount } from 'vue'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import request from '@/utils/request'
import { useToast } from '@/composables/useToast'

const props = defineProps({
  chapter: Object
})

const emit = defineEmits(['update'])
const toast = useToast()

const localChapter = ref({})
const isUploading = ref(false)
const isDragOver = ref(false)
const fileInput = ref(null)

const editor = useEditor({
  content: '',
  extensions: [StarterKit],
  editorProps: {
    attributes: {
      class: 'focus:outline-none prose prose-invert max-w-none',
    },
  },
  onUpdate: ({ editor }) => {
    localChapter.value.content = editor.getHTML()
    emitUpdate()
  },
})

watch(() => props.chapter, (newVal) => {
  if (newVal) {
    localChapter.value = { ...newVal }
    if (editor.value) {
        const currentContent = editor.value.getHTML()
        // Only update if content is different to avoid cursor jumps
        if (currentContent !== newVal.content && newVal.content !== undefined) {
            editor.value.commands.setContent(newVal.content)
        } else if (newVal.content === undefined && currentContent !== '<p></p>') {
             editor.value.commands.setContent('')
        }
    }
  }
}, { immediate: true })

const emitUpdate = () => {
  emit('update', localChapter.value)
}

const triggerFileInput = () => {
  fileInput.value.click()
}

const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (file) {
    handleFileUpload(file)
  }
}

const handleDrop = (event) => {
  isDragOver.value = false
  const file = event.dataTransfer.files[0]
  if (file) {
    handleFileUpload(file)
  }
}

const handleFileUpload = async (file) => {
  // Validation
  if (!file.type.startsWith('video/')) {
    toast.error('Please upload a video file.')
    return
  }
  if (file.size > 500 * 1024 * 1024) {
    toast.error('File size exceeds 500MB limit.')
    return
  }

  isUploading.value = true
  const formData = new FormData()
  formData.append('file', file)

  try {
    const res = await request.post('/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    localChapter.value.video_url = res.url
    emitUpdate()
  } catch (error) {
    console.error('Upload failed:', error)
    toast.error('Failed to upload video.')
  } finally {
    isUploading.value = false
    // Reset input
    if (fileInput.value) fileInput.value.value = ''
  }
}

onBeforeUnmount(() => {
  editor.value?.destroy()
})
</script>

<style>
/* Basic Tiptap Styles if Typography plugin is missing */
.ProseMirror ul {
  list-style-type: disc;
  padding-left: 1.5em;
}
.ProseMirror ol {
  list-style-type: decimal;
  padding-left: 1.5em;
}
.ProseMirror h2 {
  font-size: 1.5em;
  font-weight: bold;
  margin-top: 1em;
  margin-bottom: 0.5em;
}
.ProseMirror p {
  margin-bottom: 1em;
}
</style>
