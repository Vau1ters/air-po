import { Entity } from '../ecs/entity'
import { EntityFactory } from './entityFactory'
import { BalloonVineFactory } from './balloonVineFactory'
import { Enemy1Factory } from './enemy1Factory'
import { World } from '../ecs/world'
import { Family, FamilyBuilder } from '../ecs/family'
import { assert } from '../../utils/assertion'

export type NPCType = 'enemy1' | 'balloonvine'

export class NPCFactory extends EntityFactory {
  private family: Family

  public constructor(private world: World, private type: NPCType) {
    super()
    this.family = new FamilyBuilder(this.world).include('Player').build()
  }

  public create(): Entity {
    switch (this.type) {
      case 'enemy1':
        return new Enemy1Factory(this.world).create()
      case 'balloonvine':
        assert(this.family)
        return new BalloonVineFactory(this.world, this.family).create()
      default:
        assert(false)
    }
  }
}
