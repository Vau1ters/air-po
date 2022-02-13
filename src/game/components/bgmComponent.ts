import { SoundName } from '@core/sound/sound'
import { SoundInstance } from '@core/sound/soundInstance'

export class BgmComponent {
  public requestQueue: Array<SoundName | undefined> = []
  public instance?: SoundInstance

  request(name?: SoundName): void {
    this.requestQueue.push(name)
  }
}
