import { Entity } from '../ecs/entity'
import { EntityFactory } from './entityFactory'
import { Enemy1Factory } from './enemy1Factory'
import { assert } from '../../utils/assertion'

type EnemyType = 'enemy1'

export class EnemyFactory extends EntityFactory {
  private type?: EnemyType

  public create(): Entity {
    switch (this.type) {
      case 'enemy1':
        return new Enemy1Factory().create()
      default:
        assert(false)
    }
  }

  public setType(type: EnemyType): EnemyFactory {
    this.type = type
    return this
  }
}
