import { Entity } from '@core/ecs/entity'
import { World } from '@core/ecs/world'
import { SoundComponent } from '@game/components/soundComponent'
import { PlayOptions } from '@pixi/sound'
import { EntityFactory } from './entityFactory'

export class SoundFactory extends EntityFactory {
  public constructor(public entity: Entity, public name: string, public options?: PlayOptions) {
    super()
  }

  public create(): Entity {
    const entity = new Entity()
    entity.addComponent('Sound', new SoundComponent(this.entity, this.name, this.options))

    return entity
  }
}

type SoundCreateOptions = {
  world: World
  entity: Entity
  name: string
  options?: PlayOptions
}

export const createSound = ({ world, entity, name, options }: SoundCreateOptions): void => {
  world.addEntity(new SoundFactory(entity, name, options).create())
}
