<template>
  <draggable
    class="drag-area min-h-2.5 space-y-1"
    tag="ul"
    :list="list"
    :group="{ name: 'g1' }"
    item-key="id"
    @change="onChange"
  >
    <template #item="{ element }">
      <li>
        <div
          class="flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-ctp-surface0 group border border-transparent"
          :class="{ 'bg-ctp-surface1 text-ctp-blue border-ctp-blue': selectedId === element.id }"
          @click.stop="$emit('select', element.id)"
        >
          <span class="truncate text-sm text-ctp-text">{{ element.title }}</span>
          <div class="hidden group-hover:flex gap-2">
             <button @click.stop="$emit('add', element.id)" class="text-ctp-green hover:text-ctp-green/80" title="Add Child">
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
             </button>
             <button @click.stop="$emit('delete', element.id)" class="text-ctp-red hover:text-ctp-red/80" title="Delete">
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
             </button>
          </div>
        </div>

        <div class="pl-4 border-l border-ctp-surface1 ml-2" v-if="element.children">
            <NestedDraggable
                :list="element.children"
                :selected-id="selectedId"
                @select="$emit('select', $event)"
                @add="$emit('add', $event)"
                @delete="$emit('delete', $event)"
                @change="$emit('change', $event)"
            />
        </div>
      </li>
    </template>
  </draggable>
</template>

<script setup>
import draggable from 'vuedraggable'

defineProps({
  list: {
    required: true,
    type: Array
  },
  selectedId: [Number, String]
})

const emit = defineEmits(['select', 'add', 'delete', 'change'])

const onChange = (evt) => {
    emit('change', evt)
}
</script>
