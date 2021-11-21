import { Behaviour } from '@core/behaviour/behaviour'
import { wait } from '@core/behaviour/wait'
import { Entity } from '@core/ecs/entity'
import { CollisionCallbackArgs } from '@game/components/colliderComponent'
import { loadData, StoryStatus, saveData } from '@game/playdata/playdata'
import { Stage } from '@game/stage/stage'
import { createHash } from 'crypto'
import { animate } from '../common/action/animate'

export const respawnAI = function*(entity: Entity, stage: Stage): Behaviour<void> {
  const hash = createHash('md5')
  hash.update(entity.getComponent('Position').x.toString())
  hash.update(entity.getComponent('Position').y.toString())
  const spawnerID = parseInt('0x' + hash.digest('hex'), 16)
  stage.registerSpawner(spawnerID, entity.getComponent('Position'))

  let activated = false
  const [collider] = entity.getComponent('Collider').colliders
  collider.callbacks.add((args: CollisionCallbackArgs): void => {
    const {
      other: { entity: player },
    } = args
    const playerData = player.getComponent('Player').playerData

    const currentData = loadData()
    currentData.storyStatus = StoryStatus.Stage
    currentData.spawnPoint = {
      spawnerID,
      stageName: stage.stageName,
    }
    currentData.playerData = playerData
    currentData.playerData.hp = currentData.playerData.maxHp
    currentData.playerData.air = player.getComponent('AirHolder').maxQuantity

    saveData(currentData)
    activated = true
  })

  yield* wait.until(() => activated)

  yield* animate({
    entity,
    state: 'Activating',
    loopCount: 1,
  })

  yield* animate({
    entity,
    state: 'Activated',
    loopCount: Infinity,
  })
}
