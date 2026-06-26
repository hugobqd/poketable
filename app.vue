<template>
  <div class="app">
    <Transition name="screen" mode="out-in">
      <ScreenOnboarding v-if="game.screen === 'onboarding'" key="onboarding" />
      <ScreenConfig v-else-if="game.screen === 'config'" key="config" />
      <ScreenBoard v-else-if="game.screen === 'play'" key="play" />
      <ScreenFinish v-else-if="game.screen === 'finish'" key="finish" />
      <ScreenPokedex v-else-if="game.screen === 'pokedex'" key="pokedex" />
    </Transition>
  </div>
</template>

<script setup lang="ts">
const game = useGameStore()
onMounted(() => game.init())
</script>
