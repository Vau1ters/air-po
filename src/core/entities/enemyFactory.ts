import { Entity } from '../ecs/entity'
import { EntityFactory } from './entityFactory'
import { BalloonVineFactory } from './balloonVineFactory'
import { Enemy1Factory } from './enemy1Factory'
import { World } from '../ecs/world'
import { Family, FamilyBuilder } from '../ecs/family'
import { assert } from '../../utils/assertion'

export type EnemyType = 'enemy1' | 'balloonvine'

export class EnemyFactory extends EntityFactory {
  private type?: EnemyType
  private family?: Family

  public create(): Entity {
    switch (this.type) {
      case 'enemy1':
        return new Enemy1Factory().create()
      case 'balloonvine':
        assert(this.family)
        return new BalloonVineFactory().setPlayerFamily(this.family).create()
      default:
        assert(false)
    }
  }

  public setType(type: EnemyType): EnemyFactory {
    this.type = type
    return this
  }

  public setWorld(world: World): EnemyFactory {
    this.family = new FamilyBuilder(world).include('Player').build()
    return this
  }
}
