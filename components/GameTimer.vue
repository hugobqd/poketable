<template>
  <div class="timer" :class="{ urgent: timeLeft <= 10 }">
    <svg viewBox="0 0 100 100" class="timer-svg">
      <circle
        class="timer-track"
        cx="50" cy="50" r="44"
        fill="none"
        stroke-width="8"
      />
      <circle
        class="timer-progress"
        cx="50" cy="50" r="44"
        fill="none"
        stroke-width="8"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="dashOffset"
        transform="rotate(-90 50 50)"
      />
    </svg>
    <div class="timer-text">{{ timeLeft }}</div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  timeLeft: number
  total: number
}>()

const emit = defineEmits<{
  tick: [timeLeft: number]
  expired: []
}>()

const circumference = 2 * Math.PI * 44
const dashOffset = computed(() => circumference * (1 - props.timeLeft / props.total))

let interval: ReturnType<typeof setInterval> | null = null
const localTime = ref(props.total)

onMounted(() => {
  localTime.value = props.total
  interval = setInterval(() => {
    localTime.value--
    emit("tick", localTime.value)
    if (localTime.value <= 0) {
      clearInterval(interval!)
      emit("expired")
    }
  }, 1000)
})

onUnmounted(() => {
  if (interval) clearInterval(interval)
})
</script>
