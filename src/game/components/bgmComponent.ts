import { SoundName } from '@core/sound/sound'

export class BgmComponent {
  public requestQueue: Array<SoundName | undefined> = []

  start(name: SoundName): void {
    this.requestQueue.push(name)
  }

  stop(): void {
    this.requestQueue.push(undefined)
  }

  change(name: SoundName): void {
    this.requestQueue.push(name)
  }
}
