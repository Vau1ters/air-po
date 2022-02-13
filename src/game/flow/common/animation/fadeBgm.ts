import { Behaviour } from '@core/behaviour/behaviour'
import { parallelAny } from '@core/behaviour/composite'
import { wait } from '@core/behaviour/wait'
import { Entity } from '@core/ecs/entity'
import { World } from '@core/ecs/world'
import { SoundName } from '@core/sound/sound'
import { BgmComponent } from '@game/components/bgmComponent'
import AISystem from '@game/systems/aiSystem'

function* waitBgmComplete(bgm: BgmComponent, bgmName?: SoundName): Behaviour<void> {
  bgm.request(bgmName)
  yield* wait.until((): boolean => bgm.requestQueue.length === 0 && bgm.instance === undefined)
}

export function* fadeBgm(bgm: Entity, bgmName?: SoundName): Behaviour<void> {
  const world = new World()
  world.addSystem(new AISystem(world))
  world.addEntity(bgm)

  yield* parallelAny([world.execute(), waitBgmComplete(bgm.getComponent('Bgm'), bgmName)])
}
