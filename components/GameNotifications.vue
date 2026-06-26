<template>
  <div class="notifications">
    <TransitionGroup name="notif">
      <div
        v-for="n in notifications"
        :key="n.id"
        class="notification"
        :class="n.correct ? 'notif-correct' : 'notif-wrong'"
      >
        {{ n.correct ? "Bravo !" : "Raté !" }}
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  notifications: { id: number; correct: boolean }[]
}>()
</script>
