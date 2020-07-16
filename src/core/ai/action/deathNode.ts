import { BehaviourNode, ExecuteResult } from '../behaviour'
import { Entity } from '../../ecs/entity'
import { World } from '../../ecs/world'

export class DeathNode extends BehaviourNode {
  private entity: Entity
  private world: World

  public constructor(entity: Entity, world: World) {
    super()
    this.entity = entity
    this.world = world
  }

  protected async behaviour(): Promise<ExecuteResult> {
    this.world.removeEntity(this.entity)
    return 'Success'
  }
}
