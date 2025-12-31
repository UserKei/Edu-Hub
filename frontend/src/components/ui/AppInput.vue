<script setup>
import { Icon } from '@iconify/vue'

defineProps({
  label: {
    type: String,
    default: ''
  },
  modelValue: {
    type: [String, Number],
    default: ''
  },
  type: {
    type: String,
    default: 'text'
  },
  placeholder: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: ''
  }
})

defineEmits(['update:modelValue'])
</script>

<template>
  <div class="flex flex-col gap-2">
    <label v-if="label" class="text-ctp-text text-lg font-medium">
      {{ label }}
    </label>
    <div class="relative flex items-center">
      <div v-if="icon" class="absolute left-4 text-ctp-overlay1">
        <Icon :icon="icon" width="24" height="24" />
      </div>
      <input
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        class="w-full h-15 bg-ctp-surface0 text-ctp-text placeholder-ctp-overlay1 rounded-lg focus:outline-none focus:ring-2 focus:ring-ctp-blue transition-all"
        :class="[icon ? 'pl-12 pr-4' : 'px-4']"
        @input="$emit('update:modelValue', $event.target.value)"
      />
    </div>
  </div>
</template>
