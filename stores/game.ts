import { defineStore } from "pinia"
import { pokedex, type Pokemon } from "~/data/pokedex"
import { createRiddle, type Riddle } from "~/utils/createRiddle"
import { countScore } from "~/utils/countScore"

export type Screen = "onboarding" | "config" | "play" | "finish" | "pokedex"

export interface Player {
  name: string
  avatar: number
}

export interface Config {
  multi: boolean
  multiMax: number
  addiMax: number
  soundOn: boolean
}

export interface Results {
  addi: Record<string, number[]>
  multi: Record<string, number[]>
}

const DEFAULT_CONFIG: Config = {
  multi: true,
  multiMax: 5,
  addiMax: 10,
  soundOn: true,
}

const DEFAULT_RESULTS: Results = {
  addi: { "10": [], "20": [], "30": [], "40": [], "50": [], "60": [], "70": [], "80": [], "90": [], "100": [] },
  multi: { "1": [], "2": [], "3": [], "4": [], "5": [], "6": [], "7": [], "8": [], "9": [], "10": [] },
}

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function loadFromStorage<T>(key: string, fallback: T): T {
  if (import.meta.server) return fallback
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    const parsed = JSON.parse(raw)
    return Array.isArray(fallback) ? parsed : { ...fallback, ...parsed }
  } catch {
    return fallback
  }
}

function saveToStorage(key: string, value: unknown) {
  if (import.meta.server) return
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {}
}

export const useGameStore = defineStore("game", () => {
  const screen = ref<Screen>("onboarding")

  // Player profile
  const player = ref<Player | null>(null)

  // Game config
  const config = ref<Config>({ ...DEFAULT_CONFIG })
  const results = ref<Results>(JSON.parse(JSON.stringify(DEFAULT_RESULTS)))

  // Persistent collection across all sessions
  const caughtNumbers = ref<string[]>([])

  // Current session state
  const lives = ref(3)
  const catches = ref<Pokemon[]>([])
  const sessionNewCatches = ref<Pokemon[]>([])
  const riddle = ref<Riddle>({ a: 0, b: 0, s: 0 })
  const timeLeft = ref(90)
  const isLost = ref(false)
  const shuffledPokedex = ref<Pokemon[]>([])
  const pokeIndex = ref(0)

  const notifications = ref<{ id: number; correct: boolean }[]>([])
  let notifId = 0

  function init() {
    const savedPlayer = loadFromStorage<Player | null>("player", null)
    const savedConfig = loadFromStorage<Config>("config", DEFAULT_CONFIG)
    const savedResults = loadFromStorage<Results>("results", JSON.parse(JSON.stringify(DEFAULT_RESULTS)))
    const savedCaught = loadFromStorage<string[]>("caughtNumbers", [])

    config.value = savedConfig
    results.value = savedResults
    caughtNumbers.value = savedCaught

    if (savedPlayer && savedPlayer.name) {
      player.value = savedPlayer
      screen.value = "config"
    } else {
      screen.value = "onboarding"
    }
  }

  function createPlayer(name: string, avatar: number) {
    player.value = { name, avatar }
    saveToStorage("player", player.value)
    screen.value = "config"
  }

  function resetPlayer() {
    player.value = null
    screen.value = "onboarding"
  }

  function updateConfig(partial: Partial<Config>) {
    config.value = { ...config.value, ...partial }
    saveToStorage("config", config.value)
  }

  function startGame() {
    lives.value = 3
    catches.value = []
    sessionNewCatches.value = []
    isLost.value = false
    timeLeft.value = 90
    shuffledPokedex.value = shuffleArray([...pokedex])
    pokeIndex.value = 0
    riddle.value = createRiddle(config.value)
    screen.value = "play"
  }

  function currentPokemon(): Pokemon | undefined {
    return shuffledPokedex.value[pokeIndex.value]
  }

  function addNotification(correct: boolean) {
    const id = notifId++
    notifications.value.push({ id, correct })
    setTimeout(() => {
      notifications.value = notifications.value.filter((n) => n.id !== id)
    }, 1200)
  }

  function answer(value: number): "correct" | "wrong" | "lost" {
    if (value === riddle.value.s) {
      const caught = shuffledPokedex.value[pokeIndex.value]
      catches.value = [...catches.value, caught]
      pokeIndex.value++
      riddle.value = createRiddle(config.value)
      addNotification(true)
      return "correct"
    } else {
      lives.value--
      addNotification(false)
      if (lives.value <= 0) {
        isLost.value = true
        return "lost"
      }
      return "wrong"
    }
  }

  function endGame() {
    // Persist new catches to the permanent collection
    const newOnes = catches.value.filter((p) => !caughtNumbers.value.includes(p.number))
    sessionNewCatches.value = newOnes
    if (newOnes.length > 0) {
      caughtNumbers.value = [...caughtNumbers.value, ...newOnes.map((p) => p.number)]
      saveToStorage("caughtNumbers", caughtNumbers.value)
    }

    // Update score ranking
    const score = countScore({
      catchCount: catches.value.length,
      multi: config.value.multi,
      multiMax: config.value.multiMax,
      addiMax: config.value.addiMax,
    })
    const key = config.value.multi ? String(config.value.multiMax) : String(config.value.addiMax)
    const mode = config.value.multi ? "multi" : "addi"
    const currentScores = [...(results.value[mode][key] || [])]
    currentScores.push(score)
    currentScores.sort((a, b) => b - a)
    results.value = {
      ...results.value,
      [mode]: { ...results.value[mode], [key]: currentScores.slice(0, 10) },
    }
    saveToStorage("results", results.value)
    screen.value = "finish"
  }

  function goToConfig() {
    screen.value = "config"
  }

  function goToPokedex() {
    screen.value = "pokedex"
  }

  const currentScore = computed(() =>
    countScore({
      catchCount: catches.value.length,
      multi: config.value.multi,
      multiMax: config.value.multiMax,
      addiMax: config.value.addiMax,
    })
  )

  const currentRankingKey = computed(() =>
    config.value.multi ? String(config.value.multiMax) : String(config.value.addiMax)
  )

  const currentRankingScores = computed(() => {
    const mode = config.value.multi ? "multi" : "addi"
    return results.value[mode][currentRankingKey.value] || []
  })

  const caughtPokemonList = computed(() =>
    pokedex.filter((p) => caughtNumbers.value.includes(p.number))
  )

  return {
    screen,
    player,
    config,
    results,
    lives,
    catches,
    sessionNewCatches,
    riddle,
    timeLeft,
    isLost,
    pokeIndex,
    shuffledPokedex,
    notifications,
    caughtNumbers,
    caughtPokemonList,
    currentScore,
    currentRankingKey,
    currentRankingScores,
    init,
    createPlayer,
    resetPlayer,
    updateConfig,
    startGame,
    currentPokemon,
    answer,
    endGame,
    goToConfig,
    goToPokedex,
  }
})
