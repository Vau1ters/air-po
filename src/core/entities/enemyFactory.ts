import { Entity } from '../ecs/entity'
import { EntityFactory } from './entityFactory'
import { Enemy1Factory } from './enemy1Factory'
import { assert } from '../../utils/assertion'
import { World } from '../ecs/world'
import { SnibeeFactory } from './snibeeFactory'

type EnemyType = 'enemy1' | 'snibee'

export class EnemyFactory extends EntityFactory {
  private type?: EnemyType

  public constructor(private world: World) {
    super()
  }

  public create(): Entity {
    switch (this.type) {
      case 'enemy1':
        return new Enemy1Factory(this.world).create()
      case 'snibee':
        return new SnibeeFactory(this.world).create()
      default:
        assert(false)
    }
  }

  public setType(type: EnemyType): EnemyFactory {
    this.type = type
    return this
  }
}
