import { BehaviourNode, ExecuteResult } from '../behaviour'
import { Entity } from '../../ecs/entity'
import { World } from '../../ecs/world'
import { SequenceNode } from '../composite/sequenceNode'
import { MoveNode, Direction } from '../action/moveNode'
import { AnimationNode } from '../action/animationNode'
import { WaitNode } from '../action/waitNode'
import { EmitAirNode } from '../action/emitAirNode'
import { DeathNode } from '../action/deathNode'

export class Enemy1AI extends BehaviourNode {
  private entity: Entity
  private world: World

  public constructor(entity: Entity, world: World) {
    super()
    this.entity = entity
    this.world = world
  }

  protected async behaviour(): Promise<ExecuteResult> {
    while (!this.isDead()) {
      await new SequenceNode([
        new MoveNode(this.entity, Direction.Right, 2, 60),
        new MoveNode(this.entity, Direction.Left, 2, 60),
      ]).execute()
    }
    await new AnimationNode(this.entity, 'Dying').execute()
    await new WaitNode(60).execute()
    await new EmitAirNode(this.entity, this.world, 50).execute()
    await new DeathNode(this.entity, this.world).execute()
    return 'Success'
  }

  private isDead(): boolean {
    const hpComponent = this.entity.getComponent('HP')
    return hpComponent.hp <= 0
  }
}
