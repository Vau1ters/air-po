import { BehaviourNode, Behaviour } from './behaviourNode'
import { Entity } from '../ecs/entity'
import { World } from '../ecs/world'
import { AnimationNode } from './action/animationNode'
import { WaitNode } from './action/waitNode'
import { EmitAirNode } from './action/emitAirNode'
import { DeathNode } from './action/deathNode'
import { MoveNode, Direction } from './action/moveNode'
import { WhileNode } from './decorator/whileNode'
import { SequenceNode } from './composite/sequenceNode'

export class Enemy1AI extends BehaviourNode {
  private entity: Entity
  private world: World

  public constructor(entity: Entity, world: World) {
    super()
    this.entity = entity
    this.world = world
  }

  protected *behaviour(): Behaviour {
    yield* new WhileNode(
      () => !this.isDeath(),
      new SequenceNode([
        new MoveNode(this.entity, Direction.Right, 2, 60),
        new MoveNode(this.entity, Direction.Left, 2, 60),
      ])
    ).iterator

    yield* new AnimationNode(this.entity, 'Dying').iterator
    yield* new WaitNode(60).iterator
    yield* new EmitAirNode(this.entity, this.world, 50).iterator
    yield* new DeathNode(this.entity, this.world).iterator
    return 'Success'
  }

  private isDeath(): boolean {
    const hpComponent = this.entity.getComponent('HP')
    return hpComponent.hp <= 0
  }
}
