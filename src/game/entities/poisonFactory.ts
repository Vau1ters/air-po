import { Entity } from '@core/ecs/entity'
import { Vec2 } from '@core/math/vec2'
import { AttackComponent } from '@game/components/attackComponent'
import { BulletComponent } from '@game/components/bulletComponent'
import { EntityFactory } from './entityFactory'
import { loadEntity } from './loader/EntityLoader'

export class PoisonFactory extends EntityFactory {
  private position: Vec2 = new Vec2()
  private direction: Vec2 = new Vec2()

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

    entity.addComponent('Position', this.position)
    entity.addComponent('Bullet', new BulletComponent(180))
    entity.addComponent('Attack', new AttackComponent(1, false))
    entity.getComponent('RigidBody').velocity = this.direction.normalize().mul(20)
    console.log(entity)

    return entity
  }
}
