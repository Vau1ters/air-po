import { windowSize } from '@core/application'
import { Family, FamilyBuilder } from '@core/ecs/family'
import { System } from '@core/ecs/system'
import { World } from '@core/ecs/world'

export default class SoundSystem extends System {
  private playerFamily: Family
  private soundFamily: Family

  public constructor(world: World) {
    super(world)

    this.playerFamily = new FamilyBuilder(world).include('Player', 'Position').build()
    this.soundFamily = new FamilyBuilder(world).include('Sound', 'Position').build()
  }

  public update(): void {
    const [player] = this.playerFamily.entityArray
    const playerPosition = player.getComponent('Position')
    for (const entity of this.soundFamily.entityIterator) {
      const entityPosition = entity.getComponent('Position')
      const sound = entity.getComponent('Sound')

      const direction = entityPosition.sub(playerPosition)
      const distance = direction.length()

      for (const {
        instance,
        options: { volume },
      } of sound.sounds) {
        instance.volume = Math.max(volume * (1 - distance / (windowSize.width * 0.5)), 0)
        instance.pan = direction.x / distance
      }
      sound.sounds = sound.sounds.filter(s => !s.completed)
    }
  }
}
