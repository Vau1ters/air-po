import { Entity } from '@core/ecs/entity'
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

export const createSound = (entity: Entity, name: string, options?: PlayOptions): Entity =>
  new SoundFactory(entity, name, options).create()
