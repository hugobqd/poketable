<template>
  <div class="ranking-table">
    <div class="ranking-tabs">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        class="ranking-tab"
        :class="{ active: activeTab === tab.key }"
        @click="activeTab = tab.key"
      >
        {{ tab.label }}
      </button>
    </div>

    <div class="ranking-levels">
      <div
        v-for="level in activeLevels"
        :key="level.key"
        class="ranking-level"
      >
        <h4 class="level-title">{{ activeTab === "multi" ? "×" : "+" }}{{ level.key }}</h4>
        <ol class="level-scores">
          <li v-for="(score, i) in level.scores" :key="i">
            <span>{{ i + 1 }}.</span> {{ score }}
          </li>
          <li v-if="level.scores.length === 0" class="no-score">—</li>
        </ol>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const game = useGameStore()

const tabs = [
  { key: "multi", label: "Multiplication" },
  { key: "addi", label: "Addition" },
]

const activeTab = ref<"multi" | "addi">(game.config.multi ? "multi" : "addi")

const activeLevels = computed(() => {
  const data = game.results[activeTab.value]
  return Object.entries(data)
    .sort((a, b) => Number(a[0]) - Number(b[0]))
    .map(([key, scores]) => ({ key, scores: scores as number[] }))
})
</script>
