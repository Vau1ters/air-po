import { Family, FamilyBuilder } from '@core/ecs/family'
import { dependsOn, System } from '@core/ecs/system'
import { World } from '@core/ecs/world'
import { Vec2 } from '@core/math/vec2'

export default class BackgroundSystem extends System {
  private backgroundFamily: Family
  private cameraFamily: Family
  private cameraStartPosition?: Vec2

  public constructor(world: World) {
    super(world)

    this.backgroundFamily = new FamilyBuilder(world).include('Background').build()
    this.cameraFamily = new FamilyBuilder(world).include('Camera').build()
  }

  @dependsOn({
    before: ['DrawSystem:update'],
    after: ['CameraSystem:update'],
  })
  public update(): void {
    for (const camera of this.cameraFamily.entityIterator) {
      const cameraPosition = camera.getComponent('Position')
      if (!this.cameraStartPosition) this.cameraStartPosition = cameraPosition.copy()

      const cameraDiff = cameraPosition.sub(this.cameraStartPosition)

      for (const background of this.backgroundFamily.entityIterator) {
        const bgComponent = background.getComponent('Background')
        const bgPosition = background.getComponent('Position')
        bgPosition.x = this.cameraStartPosition.x + cameraDiff.x * bgComponent.scrollSpeed.x
        bgPosition.y = this.cameraStartPosition.y + cameraDiff.y * bgComponent.scrollSpeed.y
      }
    }
  }
}
