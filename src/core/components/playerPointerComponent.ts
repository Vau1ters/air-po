import { Entity } from '../ecs/entity'
import { Family } from '../ecs/family'

export class PlayerPointerComponent {
  public constructor(public playerFamily: Family) {}

  getPlayer(): Entity | undefined {
    return this.playerFamily.entityArray[0]
  }
}
