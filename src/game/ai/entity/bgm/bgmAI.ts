import { Behaviour } from '@core/behaviour/behaviour'
import { ease } from '@core/behaviour/easing/easing'
import { linear } from '@core/behaviour/easing/functions'
import { Entity } from '@core/ecs/entity'
import { play, SoundName } from '@core/sound/sound'
import { SoundInstance } from '@core/sound/soundInstance'
import { BgmComponent } from '@game/components/bgmComponent'

const crossFade = function* (
  prev: SoundInstance | undefined,
  nextName: SoundName | undefined
): Behaviour<SoundInstance | undefined> {
  const next = nextName ? play(nextName) : undefined
  yield* ease(linear)(
    60,
    (volume: number): void => {
      if (next) next.volume = volume
      if (prev) prev.volume = 1 - volume
    },
    { from: 0, to: 1 }
  )
  if (prev) prev.stop()
  return next
}

const waitRequest = function* (bgm: BgmComponent): Behaviour<SoundName | undefined> {
  while (bgm.requestQueue.length === 0) yield
  return bgm.requestQueue.shift()
}

export const bgmAI = function* (entity: Entity): Behaviour<void> {
  const bgm = entity.getComponent('Bgm')

  let inst = undefined
  while (true) {
    const nextRequest = yield* waitRequest(bgm)
    inst = yield* crossFade(inst, nextRequest)
  }
}
