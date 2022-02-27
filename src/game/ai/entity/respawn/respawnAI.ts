import { Behaviour } from '@core/behaviour/behaviour'
import { branch, BranchController } from '@core/behaviour/branch'
import { wait } from '@core/behaviour/wait'
import { Entity } from '@core/ecs/entity'
import { loadData, StoryStatus, saveData } from '@game/playdata/playdata'
import { animate } from '../common/action/animate'

export const respawnAI = function* (entity: Entity): Behaviour<void> {
  const [collider] = entity.getComponent('Collider').colliders
  const sound = entity.getComponent('Sound')

  yield* branch({
    Waiting: function* (controller: BranchController<void>): Behaviour<void> {
      const collisionResults = yield* wait.collision(collider)
      const [
        {
          other: { entity: player },
        },
      ] = collisionResults
      const playerData = player.getComponent('Player').playerData

      const currentData = loadData()
      currentData.storyStatus = StoryStatus.Stage
      currentData.spawnPoint = entity.getComponent('StagePoint').stagePoint
      currentData.playerData = playerData
      currentData.playerData.hp = currentData.playerData.maxHp
      currentData.playerData.air = player.getComponent('AirHolder').maxQuantity

      saveData(currentData)

      controller.transit('Activating')
      yield
    },
    Activating: function* (controller: BranchController<void>): Behaviour<void> {
      sound.addSound('flag')
      yield* animate({
        entity,
        state: 'Activating',
        loopCount: 1,
      })

      controller.transit('Activated')
      yield
    },
    Activated: function* (controller: BranchController<void>): Behaviour<void> {
      yield* animate({
        entity,
        state: 'Activated',
        loopCount: Infinity,
      })
      controller.finish()
    },
  }).start('Waiting')
}
