import { BehaviourNode, Behaviour } from '../behaviourNode'
import { World } from '../../ecs/world'
import { Entity } from '../../ecs/entity'

export class DeathNode extends BehaviourNode {
  private entity: Entity
  private world: World

  public constructor(entity: Entity, world: World) {
    super()
    this.entity = entity
    this.world = world
  }

  protected *behaviour(): Behaviour {
    this.world.removeEntity(this.entity)
    yield
    return 'Success'
  }
}
