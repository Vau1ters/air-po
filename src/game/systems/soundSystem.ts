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

      const earDistance = 100
      const cameraZ = 10

      const leftX = cameraPosition.x - earDistance / 2 - entityPosition.x
      const leftY = cameraPosition.y - entityPosition.y
      const leftZ = cameraZ

      const rightX = cameraPosition.x + earDistance / 2 - entityPosition.x
      const rightY = cameraPosition.y - entityPosition.y
      const rightZ = cameraZ

      const distanceLeft = Math.sqrt(leftX * leftX + leftY * leftY + leftZ * leftZ)
      const distanceRight = Math.sqrt(rightX * rightX + rightY * rightY + rightZ * rightZ)
      const distanceCenter = (distanceLeft + distanceRight) / 2

      const pan = -1 + (2 * distanceLeft) / (distanceLeft + distanceRight)

      for (const instance of sound.sounds) {
        instance.volume = (instance.options.volume / distanceCenter) * 1e2
        instance.pan = pan
      }
      sound.sounds = sound.sounds.filter(s => !s.completed)
    }
  }
}
