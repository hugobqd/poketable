<template>
  <div class="screen screen-board">
    <div class="board-bg">
      <div class="board-avatar">
        <img
          :src="`/img/avatars_full/${avatars[game.player!.avatar].imgFull}`"
          :alt="game.player!.name"
        />
      </div>
    </div>

    <button class="btn-back" @click="handleBack">← Retour</button>

    <div class="board-content">
      <GameTimer :time-left="game.timeLeft" :total="90" @tick="onTick" @expired="onTimeUp" />

      <GameTarget :pokemon="game.currentPokemon()" />

      <GameDisplay
        :riddle="game.riddle"
        :multi="game.config.multi"
        :lives="game.lives"
        :is-lost="game.isLost"
      />

      <GameKeyboard
        :multi="game.config.multi"
        :multi-max="game.config.multiMax"
        :addi-max="game.config.addiMax"
        :disabled="game.isLost || game.timeLeft <= 0"
        @answer="handleAnswer"
      />
    </div>

    <GameNotifications :notifications="game.notifications" />
  </div>
</template>

<script setup lang="ts">
import { avatars } from "~/data/avatars"

const game = useGameStore()
const soundOn = computed(() => game.config.soundOn)
const sound = useSound(soundOn)

function handleAnswer(value: number) {
  const result = game.answer(value)
  if (result === "correct") {
    sound.playCorrect()
  } else if (result === "wrong") {
    sound.playWrong()
  } else if (result === "lost") {
    sound.playWrong()
    setTimeout(() => {
      sound.playGameOver()
      game.endGame()
    }, 2500)
  }
}

function onTick(timeLeft: number) {
  game.timeLeft = timeLeft
  if (timeLeft === 3) sound.playCount()
  if (timeLeft <= 0 && !game.isLost) game.endGame()
}

function onTimeUp() {
  if (!game.isLost) game.endGame()
}

function handleBack() {
  game.goToConfig()
}
</script>
