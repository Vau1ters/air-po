import { assert } from '@utils/assertion'

export class SoundInstance {
  constructor(private gainNode: GainNode, private panNode?: StereoPannerNode) {}

  set volume(value: number) {
    this.gainNode.gain.value = Math.min(1, value)
  }

  set pan(value: number) {
    assert(this.panNode, 'panning is not set on this instance')
    this.panNode.pan.value = value
  }
}
