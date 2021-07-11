import { windowSize } from '@core/application'
import { Family, FamilyBuilder } from '@core/ecs/family'
import { System } from '@core/ecs/system'
import { World } from '@core/ecs/world'
import { play } from '@core/sound/sound'

export class SoundSystem extends System {
  private soundFamily: Family
  private playerFamily: Family

  public constructor(world: World) {
    super(world)

    this.soundFamily = new FamilyBuilder(world).include('Sound').build()
    this.playerFamily = new FamilyBuilder(world).include('Player').build()
  }

  public update(): void {
    const [player] = this.playerFamily.entityArray
    for (const soundEntity of this.soundFamily.entityIterator) {
      const soundComponent = soundEntity.getComponent('Sound')

      const playerPosition = player.getComponent('Position')
      const entityPosition = soundComponent.entity.getComponent('Position')
      const direction = entityPosition.sub(playerPosition)
      const distance = direction.length()

      play(soundComponent.name, {
        ...soundComponent.playOptions,
        volume: Math.max(
          (soundComponent.playOptions?.volume ?? 0.1) * (1 - distance / (windowSize.width * 0.5)),
          0
        ),
        pan: direction.x / distance,
      })
      this.world.removeEntity(soundEntity)
    }
  }
}
