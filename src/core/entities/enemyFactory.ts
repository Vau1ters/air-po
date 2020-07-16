import { Entity } from '../ecs/entity'
import { EntityFactory } from './entityFactory'
import { Enemy1Factory } from './enemy1Factory'
import { assert } from '../../utils/assertion'
import { World } from '../ecs/world'

type EnemyType = 'enemy1'

export class EnemyFactory extends EntityFactory {
  private type?: EnemyType
  private world: World

  public constructor(world: World) {
    super()
    this.world = world
  }

  public create(): Entity {
    switch (this.type) {
      case 'enemy1':
        return new Enemy1Factory(this.world).create()
      default:
        assert(false)
    }
  }

  public setType(type: EnemyType): EnemyFactory {
    this.type = type
    return this
  }
}
