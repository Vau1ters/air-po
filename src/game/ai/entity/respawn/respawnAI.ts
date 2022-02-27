import { Behaviour } from '@core/behaviour/behaviour'
import { branch, BranchController } from '@core/behaviour/branch'
import { parallelAny } from '@core/behaviour/composite'
import { wait } from '@core/behaviour/wait'
import { Entity } from '@core/ecs/entity'
import { loadData, StoryStatus, saveData } from '@game/playdata/playdata'
import { EventNotifier } from '@utils/eventNotifier'
import { animate } from '../common/action/animate'

const someoneActivated = new EventNotifier<void>()

export const respawnAI = function* (entity: Entity): Behaviour<void> {
  const [collider] = entity.getComponent('Collider').colliders
  const sound = entity.getComponent('Sound')

  yield* branch({
    Waiting: function* (controller: BranchController<void>): Behaviour<void> {
      while (true) {
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
      }
    },
    Activating: function* (controller: BranchController<void>): Behaviour<void> {
      while (true) {
        sound.addSound('flag')
        yield* animate({
          entity,
          state: 'Activating',
          loopCount: 1,
        })

        controller.transit('Activated')
        yield
      }
    },
    Activated: function* (controller: BranchController<void>): Behaviour<void> {
      while (true) {
        someoneActivated.notify()

        yield* parallelAny([
          animate({
            entity,
            state: 'Activated',
            loopCount: Infinity,
          }),
          wait.notification(someoneActivated),
        ])

        controller.transit('Deactivating')
        yield
      }
    },
    Deactivating: function* (controller: BranchController<void>): Behaviour<void> {
      while (true) {
        yield* animate({
          entity,
          state: 'Deactivated',
          loopCount: 1,
        })

        controller.transit('Waiting')
        yield
      }
    },
  }).start('Waiting')
}
