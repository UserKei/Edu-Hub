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
        <div class="absolute inset-0 bg-ctp-crust/50 backdrop-blur-sm" @click="$emit('close')"></div>

        <!-- Modal -->
        <div
          class="relative w-full max-w-md overflow-hidden rounded-xl bg-ctp-mantle border border-ctp-surface1 shadow-xl"
          @click.stop
        >
          <div class="p-6">
            <h3 class="text-lg font-bold text-ctp-text mb-2">{{ title }}</h3>
            <p class="text-ctp-subtext0 mb-6">{{ message }}</p>

            <div class="flex justify-end gap-3">
              <button
                @click="$emit('close')"
                class="px-4 py-2 rounded-lg text-ctp-subtext0 hover:bg-ctp-surface0 transition-colors"
              >
                Cancel
              </button>
              <button
                @click="handleConfirm"
                class="px-4 py-2 rounded-lg bg-ctp-red text-ctp-base font-medium hover:bg-ctp-red/90 transition-colors"
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
defineProps({
  isOpen: Boolean,
  title: {
    type: String,
    default: 'Confirm Action'
  },
  message: {
    type: String,
    default: 'Are you sure you want to proceed?'
  }
})

const emit = defineEmits(['close', 'confirm'])

const handleConfirm = () => {
  emit('confirm')
}
</script>
