export const avatars = [
  { id: "sacha", name: "Sacha", imgFull: "sacha.png", imgPortrait: "sacha.png" },
  { id: "nephie", name: "Néphie", imgFull: "nephie.png", imgPortrait: "nephie.png" },
  { id: "kiawe", name: "Kiawé", imgFull: "kiawe.png", imgPortrait: "kiawe.png" },
  { id: "lilie", name: "Lilie", imgFull: "lilie.png", imgPortrait: "lilie.png" },
  { id: "chrys", name: "Chrys", imgFull: "chrys.png", imgPortrait: "chrys.png" },
] as const

export type Avatar = (typeof avatars)[number]
