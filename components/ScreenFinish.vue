<template>
  <div class="screen screen-finish">
    <div class="finish-card">
      <h1 class="finish-title">
        {{ game.isLost ? "Perdu !" : "Temps écoulé !" }}
      </h1>

      <div class="finish-score">
        <span class="finish-score-label">Score</span>
        <span class="finish-score-value">{{ game.currentScore }}</span>
      </div>

      <div v-if="game.catches.length > 0" class="finish-catches">
        <h3>
          Tu as attrapé <strong>{{ game.catches.length }}</strong> Pokémon
          <span v-if="game.sessionNewCatches.length > 0" class="new-badge">
            +{{ game.sessionNewCatches.length }} nouveaux !
          </span>
        </h3>
        <div class="catches-grid">
          <div
            v-for="poke in game.catches"
            :key="poke.number"
            class="catch-item"
            :class="{ 'catch-new': isNew(poke.number) }"
            :title="poke.name"
          >
            <img :src="`/img/mini/${poke.number}.png`" :alt="poke.name" />
            <span v-if="isNew(poke.number)" class="catch-new-label">NEW</span>
          </div>
        </div>
      </div>

      <div class="finish-ranking">
        <h3>Classement — {{ game.config.multi ? "×" : "+" }}{{ game.currentRankingKey }}</h3>
        <ol class="ranking-list">
          <li
            v-for="(score, i) in game.currentRankingScores"
            :key="i"
            :class="{ 'ranking-current': score === game.currentScore && !highlightedAlready(i) }"
          >
            <span class="ranking-pos">{{ i + 1 }}</span>
            <span class="ranking-score">{{ score }}</span>
          </li>
          <li v-if="game.currentRankingScores.length === 0" class="ranking-empty">
            Aucun score encore
          </li>
        </ol>
      </div>

      <div class="finish-actions">
        <button class="btn-play" @click="game.startGame()">Rejouer</button>
        <button class="btn-ranking" @click="game.goToPokedex()">Mes Pokémon</button>
        <button class="btn-ranking" @click="game.goToConfig()">Config</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const game = useGameStore()

const newNumbers = computed(() => new Set(game.sessionNewCatches.map((p) => p.number)))

function isNew(number: string) {
  return newNumbers.value.has(number)
}

function highlightedAlready(index: number): boolean {
  const scores = game.currentRankingScores
  for (let i = 0; i < index; i++) {
    if (scores[i] === game.currentScore) return true
  }
  return false
}
</script>
