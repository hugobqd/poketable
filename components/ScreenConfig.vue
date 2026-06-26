<template>
  <div class="screen screen-config">
    <div class="config-bg" />

    <div class="config-card">
      <TitleSvg class="config-title" />

      <!-- Player header -->
      <div class="player-header">
        <img
          class="player-avatar"
          :src="`/img/avatars_portrait/${avatars[game.player!.avatar].imgPortrait}`"
          :alt="game.player!.name"
        />
        <div class="player-info">
          <span class="player-name">{{ game.player!.name }}</span>
          <span class="player-caught">
            {{ game.caughtNumbers.length }} / 890 Pokémon
          </span>
        </div>
        <button class="btn-pokedex" @click="game.goToPokedex()">
          Mes Pokémon →
        </button>
      </div>

      <div class="config-section">
        <label class="config-label">Mode</label>
        <div class="mode-toggle">
          <button
            class="mode-btn"
            :class="{ active: !game.config.multi }"
            @click="setMode(false)"
          >
            <span class="mode-icon">+</span>
            Addition
          </button>
          <button
            class="mode-btn"
            :class="{ active: game.config.multi }"
            @click="setMode(true)"
          >
            <span class="mode-icon">×</span>
            Multiplication
          </button>
        </div>
      </div>

      <div class="config-section">
        <label class="config-label">
          {{ game.config.multi ? "Table jusqu'à" : "Jusqu'à" }}
          <strong>{{ game.config.multi ? game.config.multiMax : game.config.addiMax }}</strong>
        </label>
        <input
          v-if="game.config.multi"
          type="range"
          class="config-slider"
          :min="1"
          :max="10"
          :step="1"
          :value="game.config.multiMax"
          @input="setMultiMax(+($event.target as HTMLInputElement).value)"
        />
        <input
          v-else
          type="range"
          class="config-slider"
          :min="10"
          :max="100"
          :step="10"
          :value="game.config.addiMax"
          @input="setAddiMax(+($event.target as HTMLInputElement).value)"
        />
      </div>

      <div class="config-section config-sound">
        <label class="config-label">Son</label>
        <button class="sound-btn" @click="toggleSound">
          {{ game.config.soundOn ? "🔊" : "🔇" }}
        </button>
      </div>

      <div class="config-actions">
        <button class="btn-play" @click="game.startGame()">Jouer !</button>
        <button class="btn-ranking" @click="showRanking = !showRanking">
          Classement
        </button>
      </div>

      <Transition name="fade">
        <div v-if="showRanking" class="ranking-panel">
          <RankingTable />
        </div>
      </Transition>

      <button class="btn-change-player" @click="game.resetPlayer()">
        Changer de joueur
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { avatars } from "~/data/avatars"

const game = useGameStore()
const soundOn = computed(() => game.config.soundOn)
const sound = useSound(soundOn)
const showRanking = ref(false)

function setMode(multi: boolean) {
  game.updateConfig({ multi })
  sound.playTick()
}
function setMultiMax(v: number) { game.updateConfig({ multiMax: v }) }
function setAddiMax(v: number) { game.updateConfig({ addiMax: v }) }
function toggleSound() { game.updateConfig({ soundOn: !game.config.soundOn }) }
</script>
