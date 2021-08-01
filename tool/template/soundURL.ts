// HEADER

// IMPORT

export type AudioSetting = {
  path: string
  maxVolume: number
  loop?: {
    start: number
    end: number
  }
}

export const soundURL: { [key: string]: AudioSetting } = {
  // OBJECT
}
