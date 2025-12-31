<script setup>
defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'text'].includes(value)
  },
  type: {
    type: String,
    default: 'button'
  }
})
</script>

<template>
  <button
    :type="type"
    class="w-full h-15 rounded-lg font-medium text-xl transition-all flex items-center justify-center cursor-pointer"
    :class="{
      'bg-ctp-blue text-ctp-base hover:bg-ctp-blue/90': variant === 'primary',
      'bg-ctp-surface0 text-ctp-text hover:bg-ctp-surface1': variant === 'secondary',
      'bg-transparent text-ctp-blue hover:underline': variant === 'text'
    }"
  >
    <slot />
  </button>
</template>
