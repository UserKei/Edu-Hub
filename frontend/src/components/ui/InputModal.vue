<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="$emit('close')"></div>

        <!-- Modal -->
        <div
          class="relative w-full max-w-md overflow-hidden rounded-xl bg-ctp-mantle border border-ctp-surface1 shadow-xl"
          @click.stop
        >
          <div class="p-6">
            <h3 class="text-lg font-bold text-ctp-text mb-4">{{ title }}</h3>

            <input
              ref="inputRef"
              :value="modelValue"
              @input="$emit('update:modelValue', $event.target.value)"
              @keyup.enter="handleConfirm"
              @keyup.esc="$emit('close')"
              type="text"
              class="w-full rounded-lg bg-ctp-surface0 border border-ctp-surface1 p-3 text-ctp-text focus:border-ctp-blue focus:outline-none placeholder-ctp-overlay1"
              :placeholder="placeholder"
            />

            <div class="mt-6 flex justify-end gap-3">
              <button
                @click="$emit('close')"
                class="px-4 py-2 rounded-lg text-ctp-subtext0 hover:bg-ctp-surface0 transition-colors"
              >
                Cancel
              </button>
              <button
                @click="handleConfirm"
                class="px-4 py-2 rounded-lg bg-ctp-blue text-ctp-base font-medium hover:bg-ctp-blue/90 transition-colors"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'

const props = defineProps({
  isOpen: Boolean,
  title: {
    type: String,
    default: 'Input'
  },
  placeholder: {
    type: String,
    default: ''
  },
  modelValue: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue', 'close', 'confirm'])
const inputRef = ref(null)

watch(() => props.isOpen, async (val) => {
  if (val) {
    await nextTick()
    inputRef.value?.focus()
  }
})

const handleConfirm = () => {
  emit('confirm')
}
</script>
