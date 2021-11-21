import { Entity } from '@core/ecs/entity'
import { respawnAI } from '@game/ai/entity/respawn/respawnAI'
import { AiComponent } from '@game/components/aiComponent'
import { ObjectEntityFactory } from '@game/entities/objectEntityFactory'
import { createHash } from 'crypto'

export default class RespawnFactory extends ObjectEntityFactory {
  public create(): Entity {
    const entity = super.create()
    const hash = createHash('md5')
    hash.update(entity.getComponent('Position').x.toString())
    hash.update(entity.getComponent('Position').y.toString())
    const spawnerID = parseInt('0x' + hash.digest('hex'), 16)
    this.stage.registerSpawner(spawnerID, entity.getComponent('Position'))
    entity.addComponent(
      'Ai',
      new AiComponent(respawnAI(entity, { spawnerID, stageName: this.stage.stageName }))
    )
    return entity
  }
}
