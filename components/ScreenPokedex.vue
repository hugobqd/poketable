<template>
  <div class="screen screen-pokedex">
    <div class="pokedex-header">
      <button class="btn-back-light" @click="game.goToConfig()">← Retour</button>
      <div class="pokedex-title-block">
        <h1 class="pokedex-title">Mes Pokémons</h1>
        <span class="pokedex-count">
          <strong>{{ game.caughtNumbers.length }}</strong> / 890 attrapés
        </span>
      </div>
      <div class="pokedex-filters">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          class="filter-btn"
          :class="{ active: activeFilter === tab.key }"
          @click="activeFilter = tab.key"
        >
          {{ tab.label }}
        </button>
      </div>
    </div>

    <div class="pokedex-progress">
      <div
        class="pokedex-progress-bar"
        :style="{ width: `${(game.caughtNumbers.length / 890) * 100}%` }"
      />
    </div>

    <div v-if="game.caughtNumbers.length === 0 && activeFilter === 'caught'" class="pokedex-empty">
      <p>Tu n'as encore attrapé aucun Pokémon.</p>
      <button class="btn-play" @click="game.startGame()">Jouer maintenant !</button>
    </div>

    <div v-else class="pokedex-grid">
      <TransitionGroup name="poke-card">
        <div
          v-for="pokemon in displayList"
          :key="pokemon.number"
          class="poke-card"
          :class="{
            'poke-caught': isCaught(pokemon.number),
            'poke-missing': !isCaught(pokemon.number),
          }"
          @click="selected = selected?.number === pokemon.number ? null : pokemon"
        >
          <img
            class="poke-sprite"
            :src="`/img/mini/${pokemon.number}.png`"
            :alt="isCaught(pokemon.number) ? pokemon.name : '?'"
            :class="{ silhouette: !isCaught(pokemon.number) }"
          />
          <span class="poke-number">#{{ pokemon.number }}</span>
          <span class="poke-name">{{ isCaught(pokemon.number) ? pokemon.name : "???" }}</span>
          <div v-if="isCaught(pokemon.number)" class="poke-types">
            <img
              v-for="type in pokemon.type"
              :key="type"
              :src="`/img/power-${type}.png`"
              :alt="type"
              class="type-badge-sm"
            />
          </div>
        </div>
      </TransitionGroup>
    </div>

    <!-- Detail tooltip -->
    <Transition name="fade">
      <div v-if="selected" class="poke-detail" @click="selected = null">
        <img :src="`/img/hd/${selected.number}.png`" :alt="selected.name" class="detail-img" />
        <div class="detail-info">
          <span class="detail-number">#{{ selected.number }}</span>
          <span class="detail-name">{{ selected.name }}</span>
          <div class="detail-types">
            <img
              v-for="type in selected.type"
              :key="type"
              :src="`/img/power-${type}.png`"
              :alt="type"
              class="type-badge"
            />
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { pokedex, type Pokemon } from "~/data/pokedex"

const game = useGameStore()
const activeFilter = ref<"all" | "caught" | "missing">("all")
const selected = ref<Pokemon | null>(null)

const tabs = [
  { key: "all", label: "Tous" },
  { key: "caught", label: "Attrapés" },
  { key: "missing", label: "Manquants" },
]

const caughtSet = computed(() => new Set(game.caughtNumbers))

function isCaught(number: string) {
  return caughtSet.value.has(number)
}

const displayList = computed(() => {
  if (activeFilter.value === "caught") return [...pokedex].filter((p) => isCaught(p.number))
  if (activeFilter.value === "missing") return [...pokedex].filter((p) => !isCaught(p.number))
  return [...pokedex]
})
</script>
