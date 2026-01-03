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
        class="relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-ctp-surface1 bg-ctp-surface0 p-8 transition-all duration-300 hover:border-ctp-blue hover:bg-ctp-surface1/50"
        :class="{ 'border-ctp-blue bg-ctp-surface1/50': isDragOver }"
        @dragover.prevent="isDragOver = true"
        @dragleave.prevent="isDragOver = false"
        @drop.prevent="handleDrop"
      >
        <!-- Loading State -->
        <div v-if="isUploading" class="w-full max-w-xs text-center">
          <div class="mb-2 flex justify-between text-sm text-ctp-text">
            <span>Uploading...</span>
            <span>{{ uploadProgress }}%</span>
          </div>
          <div class="h-2 w-full overflow-hidden rounded-full bg-ctp-surface2">
            <div
              class="h-full bg-ctp-blue transition-all duration-300 ease-out"
              :style="{ width: `${uploadProgress}%` }"
            ></div>
          </div>
        </div>

        <!-- Preview State (Has Video) -->
        <div v-else-if="localChapter.video_url" class="w-full">
          <div class="relative aspect-video w-full overflow-hidden rounded-lg bg-black shadow-lg ring-1 ring-ctp-surface1">
            <video
              controls
              :src="localChapter.video_url"
              class="h-full w-full object-contain"
              preload="metadata"
            ></video>
          </div>

          <div class="mt-4 flex items-center justify-between rounded-lg bg-ctp-surface1/50 p-3 backdrop-blur-sm border border-ctp-surface1">
            <div class="flex items-center gap-2 text-sm text-ctp-text">
               <div class="rounded-full bg-ctp-green/20 p-1.5">
                 <Icon icon="mdi:video-check" class="text-ctp-green text-lg" />
               </div>
               <span class="font-medium">Current Video Lesson</span>
            </div>
            <div class="flex items-center gap-2">
               <button
                @click="triggerFileInput"
                class="flex items-center gap-1.5 text-sm text-ctp-blue hover:text-ctp-blue/80 transition-colors font-medium px-3 py-1.5 rounded-md hover:bg-ctp-blue/10"
                title="Replace Video"
              >
                <Icon icon="mdi:refresh" class="text-lg" />
                Replace
              </button>
              <div class="h-4 w-px bg-ctp-surface2"></div>
              <button
                @click="removeVideo"
                class="flex items-center gap-1.5 text-sm text-ctp-red hover:text-ctp-red/80 transition-colors font-medium px-3 py-1.5 rounded-md hover:bg-ctp-red/10"
                title="Remove Video"
              >
                <Icon icon="mdi:delete-outline" class="text-lg" />
                Remove
              </button>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center cursor-pointer group" @click="triggerFileInput">
          <div class="mb-3 flex justify-center">
            <div class="rounded-full bg-ctp-surface1 p-4 transition-transform duration-300 group-hover:scale-110 group-hover:bg-ctp-surface2">
              <Icon icon="mdi:cloud-upload" class="text-3xl text-ctp-blue" />
            </div>
          </div>
          <div class="text-ctp-text">
            <p class="font-medium text-lg">Click to upload video</p>
            <p class="text-sm text-ctp-subtext0 mt-1">or drag and drop</p>
            <p class="text-xs text-ctp-subtext1 mt-2">MP4, WebM (Max 500MB)</p>
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
import { Icon } from '@iconify/vue'
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
const uploadProgress = ref(0)
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

const removeVideo = () => {
  if (confirm('Are you sure you want to remove this video?')) {
    localChapter.value.video_url = null
    emitUpdate()
    toast.success('Video removed')
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
  uploadProgress.value = 0
  const formData = new FormData()
  formData.append('file', file)

  try {
    const res = await request.post('/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        uploadProgress.value = percentCompleted
      }
    })

    localChapter.value.video_url = res.url
    emitUpdate()
    toast.success('Video uploaded successfully')
  } catch (error) {
    console.error('Upload failed:', error)
    toast.error('Failed to upload video.')
  } finally {
    isUploading.value = false
    uploadProgress.value = 0
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
