import { Family, FamilyBuilder } from '@core/ecs/family'
import { dependsOn, System } from '@core/ecs/system'
import { World } from '@core/ecs/world'
import { TilingSprite } from 'pixi.js'

export default class BackgroundSystem extends System {
  private backgroundFamily: Family
  private cameraFamily: Family
  private horizonFamily: Family

  public constructor(world: World) {
    super(world)

    this.backgroundFamily = new FamilyBuilder(world).include('Background').build()
    this.cameraFamily = new FamilyBuilder(world).include('Camera').build()
    this.horizonFamily = new FamilyBuilder(world).include('Horizon').build()
  }

  @dependsOn({
    before: ['DrawSystem:update'],
    after: ['CameraSystem:update'],
  })
  public update(): void {
    for (const camera of this.cameraFamily.entityIterator) {
      for (const horizon of this.horizonFamily.entityIterator) {
        const cameraPosition = camera.getComponent('Position')
        const horizonPosition = horizon.getComponent('Position')

        const cameraDiff = cameraPosition.sub(horizonPosition)

        for (const background of this.backgroundFamily.entityIterator) {
          const bgComponent = background.getComponent('Background')
          const draw = background.getComponent('Draw')
          const [bgSprite] = draw.children as TilingSprite[]
          bgSprite.position.set(cameraPosition.x, cameraPosition.y)
          bgSprite.tilePosition.set(
            -cameraDiff.x * bgComponent.scrollSpeed.x,
            -cameraDiff.y * bgComponent.scrollSpeed.y
          )
        }
      }
    }
  }
}
