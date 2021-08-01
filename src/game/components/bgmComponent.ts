import { SoundName } from '@core/sound/sound'

export class BgmComponent {
  public requestQueue: Array<SoundName | undefined> = []

  request(name?: SoundName): void {
    this.requestQueue.push(name)
  }
}
