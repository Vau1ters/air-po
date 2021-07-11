import { assert } from '@utils/assertion'
import { PlayOptions } from './sound'

export class SoundInstance {
  private _completed = false

  constructor(
    public options: PlayOptions,
    private gainNode: GainNode,
    private panNode?: StereoPannerNode
  ) {}

  set volume(value: number) {
    this.gainNode.gain.value = Math.min(1, value)
  }

  set pan(value: number) {
    assert(this.panNode, 'panning is not set on this instance')
    this.panNode.pan.value = value
  }

  complete(): void {
    this._completed = true
  }

  get completed(): boolean {
    return this._completed
  }
}
