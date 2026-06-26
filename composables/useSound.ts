const sounds: Record<string, HTMLAudioElement | null> = {}

function getAudio(name: string, volume = 1): HTMLAudioElement | null {
  if (import.meta.server) return null
  if (!sounds[name]) {
    const audio = new Audio(`/sounds/${name}`)
    audio.volume = volume
    sounds[name] = audio
  }
  return sounds[name]
}

export function useSound(soundOn: Ref<boolean>) {
  function play(name: string, volume = 1) {
    if (!soundOn.value) return
    const audio = getAudio(name, volume)
    if (!audio) return
    audio.currentTime = 0
    audio.play().catch(() => {})
  }

  return {
    playCorrect: () => play("coin.mp3"),
    playWrong: () => play("bump.mp3"),
    playGameOver: () => play("dead.wav"),
    playTick: () => play("tick.mp3", 0.25),
    playCount: () => play("count.mp3", 0.6),
  }
}
