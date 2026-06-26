<template>
  <div class="display" :class="{ lost: isLost }">
    <div class="display-riddle">
      <Transition name="riddle" mode="out-in">
        <span :key="`${riddle.a}-${riddle.b}`" class="riddle-text">
          {{ riddle.a }} {{ multi ? "×" : "+" }} {{ riddle.b }} = ?
        </span>
      </Transition>
    </div>
    <div class="display-lives">
      <span
        v-for="i in 3"
        :key="i"
        class="life-heart"
        :class="{ empty: i > lives }"
      >♥</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Riddle } from "~/utils/createRiddle"
defineProps<{
  riddle: Riddle
  multi: boolean
  lives: number
  isLost: boolean
}>()
</script>
