<template>
  <div class="target">
    <Transition name="poke" mode="out-in">
      <div v-if="pokemon" :key="pokemon.number" class="target-inner">
        <img
          class="target-img"
          :src="`/img/hd/${pokemon.number}.png`"
          :alt="pokemon.name"
        />
        <div class="target-types">
          <img
            v-for="type in pokemon.type"
            :key="type"
            class="type-badge"
            :src="`/img/power-${type}.png`"
            :alt="type"
          />
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import type { Pokemon } from "~/data/pokedex"
defineProps<{ pokemon: Pokemon | undefined }>()
</script>
