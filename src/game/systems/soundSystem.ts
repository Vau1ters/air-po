import { windowSize } from '@core/application'
import { Family, FamilyBuilder } from '@core/ecs/family'
import { System } from '@core/ecs/system'
import { World } from '@core/ecs/world'

export default class SoundSystem extends System {
  private cameraFamily: Family
  private soundFamily: Family

  public constructor(world: World) {
    super(world)

    this.cameraFamily = new FamilyBuilder(world).include('Camera', 'Position').build()
    this.soundFamily = new FamilyBuilder(world).include('Sound', 'Position').build()
  }

  public update(): void {
    const [camera] = this.cameraFamily.entityArray
    const cameraPosition = camera.getComponent('Position')
    for (const entity of this.soundFamily.entityIterator) {
      const entityPosition = entity.getComponent('Position')
      const sound = entity.getComponent('Sound')

      const volumeMuteThreshold = 5e-3

      const pan = Math.max(
        -1,
        Math.min(1, (2 * (entityPosition.x - cameraPosition.x)) / windowSize.width)
      )
      const distance = cameraPosition.sub(entityPosition).lengthSq()

      for (const instance of sound.sounds) {
        instance.volume = 1e4 / distance
        if (instance.volume < volumeMuteThreshold) instance.volume = 0
        instance.pan = pan
      }
      sound.sounds = sound.sounds.filter(s => !s.completed)
    }
  }
}
