function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export interface Riddle {
  a: number
  b: number
  s: number
}

interface RiddleOptions {
  multi: boolean
  multiMax: number
  addiMax: number
}

export function createRiddle({ multi, multiMax, addiMax }: RiddleOptions): Riddle {
  if (multi) {
    const a = getRandomInt(1, multiMax)
    const b = getRandomInt(1, 10)
    return { a, b, s: a * b }
  } else {
    const s = getRandomInt(2, addiMax)
    const a = getRandomInt(1, s - 1)
    return { a, b: s - a, s }
  }
}
