import { play } from '@core/sound/sound'
import { SoundInstance } from '@core/sound/soundInstance'
import { SoundName } from '@core/sound/soundStore'

type Options = {
  volume: number
}

export type Sound = {
  instance: SoundInstance
  options: Options
  completed: boolean
}

export class SoundComponent {
  public sounds: Array<Sound> = []

  addSound(name: SoundName, options: Options = { volume: 0.1 }): void {
    const s = {
      instance: null as SoundInstance | null,
      options,
      completed: false,
    }
    const oncomplete = (): void => {
      s.completed = true
    }
    s.instance = play(name, { pan: 0, oncomplete, ...options })
    this.sounds.push(s as Sound)
  }
}
