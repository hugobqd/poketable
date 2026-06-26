export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@pinia/nuxt"],
  css: ["~/assets/css/main.css"],
  app: {
    head: {
      title: "Pokétable",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { name: "description", content: "Entraîne-toi aux tables de multiplication et d'addition avec tes Pokémon !" },
      ],
      link: [
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;700&display=swap",
        },
      ],
    },
  },
  vite: {
    server: {
      fs: { strict: false },
    },
  },
  compatibilityDate: "2024-09-09",
})
