interface KeyboardOptions {
  multi: boolean
  multiMax: number
  addiMax: number
}

export function createKeyboard({ multi, multiMax, addiMax }: KeyboardOptions): number[] {
  const max = multi ? multiMax * 10 : addiMax
  return Array.from({ length: max }, (_, i) => i + 1)
}
