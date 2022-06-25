import { Behaviour } from '@core/behaviour/behaviour'
import { wait } from '@core/behaviour/wait'
import { Entity } from '@core/ecs/entity'
import { World } from '@core/ecs/world'
import { SpeechBalloonFactory } from '@game/entities/speechBalloonFactory'

export const speak = function* (speaker: Entity, serif: string, world: World): Behaviour<void> {
  world.addEntity(
    new SpeechBalloonFactory(serif, speaker, world, {
      fontSize: 8,
      tint: 0x000000,
      waitForEnd: wait.frame(100),
    }).create()
  )
}
