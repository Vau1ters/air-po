import { Entity } from '@core/ecs/entity'
import { vineAI } from '@game/ai/entity/vine/vineAI'
import { AiComponent } from '@game/components/aiComponent'
import { ObjectEntityFactory } from '@game/entities/objectEntityFactory'
import { assert } from '@utils/assertion'

export const VINE_TAG = 'Vine'
export const VINE_TERRAIN_SENSOR_TAG = 'VineWallSensor'
export const VINE_AIR_SENSOR_TAG = 'VineAirSensor'
export type VineDirection = 'Down' | 'Up' | 'Left' | 'Right'

export default class VineFactory extends ObjectEntityFactory {
  public create(): Entity {
    const entity = super.create()
    entity.addComponent(
      'Ai',
      new AiComponent(vineAI(entity, this.world, this.calcDirection(this.frame)))
    )
    return entity
  }

  private calcDirection(frame: number): VineDirection {
    const dirs: Array<VineDirection> = ['Down', 'Right', 'Up', 'Left']
    const index = Math.floor(frame / 8)
    assert(0 <= index && index < dirs.length, `invalid frame number ${frame}`)
    return dirs[index]
  }
}
