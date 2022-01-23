import { Behaviour } from '@core/behaviour/behaviour'
import { wait } from '@core/behaviour/wait'
import { Family } from '@core/ecs/family'
import { World } from '@core/ecs/world'
import { SpeechBalloonFactory } from '@game/entities/speechBalloonFactory'
import { TalkAction } from '@game/movie/movie'
import { MouseController } from '@game/systems/controlSystem'
import { findActor } from './util'

export const talkActionAI = function* (
  action: TalkAction,
  world: World,
  nameFamily: Family
): Behaviour<void> {
  const actor = findActor(action.speaker, nameFamily)
  const speechBalloon = new SpeechBalloonFactory(action.content, actor, world, {
    fontSize: 8,
    tint: 0x000000,
    waitForEnd: wait.until((): boolean => MouseController.isMousePressed('Left')),
  }).create()
  world.addEntity(speechBalloon)
  yield* wait.until((): boolean => !speechBalloon.getComponent('Ai').isAlive)
}
