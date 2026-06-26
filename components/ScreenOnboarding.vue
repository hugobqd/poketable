<template>
  <div class="screen screen-onboarding">
    <div class="onboarding-bg" />

    <div class="onboarding-card">
      <TitleSvg class="onboarding-title" />
      <p class="onboarding-subtitle">Entraîne-toi aux tables et attrape des Pokémon !</p>

      <div class="onboarding-step">
        <label class="config-label" for="player-name">Ton prénom</label>
        <input
          id="player-name"
          v-model="name"
          class="name-input"
          type="text"
          placeholder="Entre ton prénom…"
          maxlength="20"
          @keydown.enter="submit"
          autofocus
        />
      </div>

      <div class="onboarding-step">
        <label class="config-label">Ton personnage</label>
        <div class="avatars avatars-large">
          <button
            v-for="(avatar, i) in avatars"
            :key="avatar.id"
            class="avatar-btn"
            :class="{ selected: selectedAvatar === i }"
            @click="selectedAvatar = i"
          >
            <img
              :src="`/img/avatars_portrait/${avatar.imgPortrait}`"
              :alt="avatar.name"
            />
            <span>{{ avatar.name }}</span>
          </button>
        </div>
      </div>

      <button
        class="btn-play btn-start"
        :disabled="!name.trim()"
        @click="submit"
      >
        Commencer l'aventure !
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { avatars } from "~/data/avatars"

const game = useGameStore()
const name = ref("")
const selectedAvatar = ref(0)

function submit() {
  if (!name.value.trim()) return
  game.createPlayer(name.value.trim(), selectedAvatar.value)
}
</script>
