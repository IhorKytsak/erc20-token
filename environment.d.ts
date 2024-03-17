declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PRIVATE_KEY_1: string
      API_KEY: string
      PINATA_API_KEY: string
      PINATA_IMAGES_CID: string
    }
  }
}

export {}
