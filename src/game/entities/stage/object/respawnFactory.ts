import { Entity } from '@core/ecs/entity'
import { ObjectEntityFactory } from '@game/entities/objectEntityFactory'
import { loadData, saveData, StoryStatus } from '@game/playdata/playdata'
import { getSingleton } from '@game/systems/singletonSystem'
import { hash } from '@utils/hash'

export default class RespawnFactory extends ObjectEntityFactory {
  public create(): Entity {
    const entity = super.create()

    const pos = entity.getComponent('Position')
    const spawnerID = hash([pos.x, pos.y])
    this.stage.registerSpawner(spawnerID, entity.getComponent('Position'))

    const [collider] = entity.getComponent('Collider').colliders
    collider.callbacks.add((): void => {
      const player = getSingleton('Player', this.world)
      const playerData = player.getComponent('Player').playerData

      const currentData = loadData()
      currentData.storyStatus = StoryStatus.Stage
      currentData.spawnPoint = {
        spawnerID,
        stageName: this.stage.stageName,
      }
      currentData.playerData = playerData
      currentData.playerData.hp = currentData.playerData.maxHp
      currentData.playerData.air = player.getComponent('AirHolder').maxQuantity

      saveData(currentData)
    })

    return entity
  }
}
