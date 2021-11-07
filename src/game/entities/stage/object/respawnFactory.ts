import { Entity } from '@core/ecs/entity'
import { ObjectEntityFactory } from '@game/entities/objectEntityFactory'
import { savePlayData, StoryStatus } from '@game/playdata/playdata'
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
      const data = player.getComponent('Player').toPlayData(StoryStatus.Stage, {
        spawnerID,
        stageName: this.stage.stageName,
      })
      savePlayData(data)
    })

    return entity
  }
}
