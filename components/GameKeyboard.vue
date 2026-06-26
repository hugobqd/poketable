<template>
  <div class="keyboard" :class="{ disabled }">
    <button
      v-for="n in keys"
      :key="n"
      class="key-btn"
      :disabled="disabled"
      @click="emit('answer', n)"
    >
      {{ n }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { createKeyboard } from "~/utils/createKeyboard"

const props = defineProps<{
  multi: boolean
  multiMax: number
  addiMax: number
  disabled: boolean
}>()

const emit = defineEmits<{ answer: [value: number] }>()

const keys = computed(() =>
  createKeyboard({
    multi: props.multi,
    multiMax: props.multiMax,
    addiMax: props.addiMax,
  })
)
</script>
