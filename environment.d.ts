declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PRIVATE_KEY_1: string
      API_KEY: string
    }
  }
}

export {}
