import { Entity } from '@core/ecs/entity'
import { World } from '@core/ecs/world'
import { Vec2 } from '@core/math/vec2'
import { poisonAI } from '@game/ai/entity/poison/poisonAI'
import { AiComponent } from '@game/components/aiComponent'
import { EntityFactory } from './entityFactory'
import { loadEntity } from './loader/EntityLoader'

export class PoisonFactory extends EntityFactory {
  private position: Vec2 = new Vec2()
  private direction: Vec2 = new Vec2()

  public constructor(public world: World) {
    super()
  }

  public setPosition(position: Vec2): this {
    this.position = position
    return this
  }

  public setDirection(direction: Vec2): this {
    this.direction = direction
    return this
  }

  public create(): Entity {
    const entity = loadEntity('poison')

    entity.addComponent('Ai', new AiComponent(entity, poisonAI(entity, this.world)))
    entity.addComponent('Position', this.position)
    entity.getComponent('RigidBody').velocity = this.direction.normalize().mul(20)

    return entity
  }
}
