import { Entity } from '@core/ecs/entity'
import { addTag } from '@game/ai/entity/vine/changeVineLength'
import { vineAI } from '@game/ai/entity/vine/vineAI'
import { AIComponent } from '@game/components/aiComponent'
import { VineComponent } from '@game/components/vineComponent'
import { TileEntityFactory } from './tileEntityFactory'

export const VINE_TAG = 'Vine'
export const VINE_TERRAIN_SENSOR_TAG = 'VineWallSensor'
export const VINE_AIR_SENSOR_TAG = 'VineAirSensor'

export class VineFactory extends TileEntityFactory {
  public create(): Entity {
    const entity = super.create()

    entity.addComponent('AI', new AIComponent(vineAI(entity)))
    entity.addComponent('Vine', new VineComponent(entity, 0))

    addTag(entity)

    return entity
  }
}
