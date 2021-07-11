import { Entity } from '@core/ecs/entity'
import { PlayOptions } from '@pixi/sound'

export class SoundComponent {
  public constructor(
    public entity: Entity,
    public name: string,
    public playOptions?: PlayOptions
  ) {}
}
