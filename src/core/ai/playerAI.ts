import { BehaviourNode, Behaviour } from './behaviourNode'
import { Entity } from '../ecs/entity'
import { World } from '../ecs/world'
import { AnimationNode } from './action/animationNode'
import { WaitNode } from './action/waitNode'
import { DeathNode } from './action/deathNode'
import { ParallelNode } from './composite/parallelNode'
import { PlayerGunShootNode } from './action/playerGunShootNode'
import { PlayerMoveNode } from './action/playerMoveNode'
import { PlayerJetNode } from './action/playerJetNode'
import { WhileNode } from './decorator/whileNode'

export class PlayerAI extends BehaviourNode {
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
      new ParallelNode([
        new PlayerGunShootNode(this.entity, this.world),
        new PlayerMoveNode(this.entity),
        new PlayerJetNode(this.entity),
      ])
    ).iterator
    yield* new AnimationNode(this.entity, 'Dying').iterator
    yield* new WaitNode(60).iterator
    yield* new DeathNode(this.entity, this.world).iterator
    return 'Success'
  }

  private isDeath(): boolean {
    const hpComponent = this.entity.getComponent('HP')
    return hpComponent.hp <= 0
  }
}
