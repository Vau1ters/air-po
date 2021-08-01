import { assert } from '@utils/assertion'

export class SoundInstance {
  private _completed = false

  constructor(
    private readonly maxVolume: number,
    private source: AudioBufferSourceNode,
    private gainNode: GainNode,
    private panNode?: StereoPannerNode
  ) {}

  set volume(value: number) {
    this.gainNode.gain.value = this.maxVolume * Math.min(1, value)
  }

  get volume(): number {
    return this.gainNode.gain.value
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

  stop(): void {
    this.source.stop(0)
  }
}
