import { BehaviourNode, ExecuteResult } from '../behaviour'
import { Entity } from '../../ecs/entity'
import { World } from '../../ecs/world'
import { AnimationNode } from '../action/animationNode'
import { WaitNode } from '../action/waitNode'
import { DeathNode } from '../action/deathNode'
import { ParallelNode } from '../composite/parallelNode'
import { PlayerGunShootNode } from '../action/playerGunShootNode'
import { PlayerMoveNode } from '../action/playerMoveNode'
import { PlayerJetNode } from '../action/playerJetNode'

export class PlayerAI extends BehaviourNode {
  private entity: Entity
  private world: World

  public constructor(entity: Entity, world: World) {
    super()
    this.entity = entity
    this.world = world
  }

  protected async behaviour(): Promise<ExecuteResult> {
    while (!this.isDead()) {
      await new ParallelNode([
        new PlayerGunShootNode(this.entity, this.world),
        new PlayerMoveNode(this.entity),
        new PlayerJetNode(this.entity),
      ]).execute()
      await new WaitNode(1).execute()
    }
    await new AnimationNode(this.entity, 'Dying').execute()
    await new WaitNode(60).execute()
    await new DeathNode(this.entity, this.world).execute()
    return 'Success'
  }

  private isDead(): boolean {
    const hpComponent = this.entity.getComponent('HP')
    return hpComponent.hp <= 0
  }
}
