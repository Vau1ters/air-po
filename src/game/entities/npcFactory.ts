import { Entity } from '@core/ecs/entity'
import { EntityFactory } from './entityFactory'
import { BalloonVineFactory } from './balloonVineFactory'
import { VineFactory } from './vineFactory'
import { DandelionFactory } from './dandelionFactory'
import { Enemy1Factory } from './enemy1Factory'
import { SnibeeFactory } from './snibeeFactory'
import { AirTotemFactory } from './airTotemFactory'
import { World } from '@core/ecs/world'
import { assert } from '@utils/assertion'

export type NPCType = 'enemy1' | 'snibee' | 'balloonvine' | 'dandelion' | 'vine' | 'airTotem'

export class NPCFactory extends EntityFactory {
  public constructor(private world: World, private type: NPCType) {
    super()
  }

  public create(): Entity {
    switch (this.type) {
      case 'enemy1':
        return new Enemy1Factory(this.world).create()
      case 'snibee':
        return new SnibeeFactory(this.world).create()
      case 'balloonvine':
        return new BalloonVineFactory(this.world).create()
      case 'vine':
        return new VineFactory().create()
      case 'dandelion':
        return new DandelionFactory(this.world).create()
      case 'airTotem':
        return new AirTotemFactory(this.world).create()
      default:
        assert(false)
    }
  }
}
