import { play, SoundName } from '@core/sound/sound'
import { SoundInstance } from '@core/sound/soundInstance'

type Options = {
  volume?: number
  isRandomisePitch?: boolean
}

export class SoundComponent {
  public sounds: Array<SoundInstance> = []

  addSound(
    name: SoundName,
    options: Options = {
      volume: 0.1,
      isRandomisePitch: false,
    }
  ): void {
    this.sounds.push(play(name, { pan: 0, ...options }))
  }
}
