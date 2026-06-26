interface ScoreOptions {
  catchCount: number
  multi: boolean
  multiMax: number
  addiMax: number
}

export function countScore({ catchCount, multi, multiMax, addiMax }: ScoreOptions): number {
  const difficulty = multi ? multiMax : addiMax
  return catchCount * difficulty
}
