import { windowSize } from '@core/application'
import { Family, FamilyBuilder } from '@core/ecs/family'
import { dependsOn, System } from '@core/ecs/system'
import { World } from '@core/ecs/world'
import { Vec2 } from '@core/math/vec2'
import { TilingSprite } from 'pixi.js'
import { getSingleton } from './singletonSystem'

export default class BackgroundSystem extends System {
  private backgroundFamily: Family

  public constructor(world: World) {
    super(world)

    this.backgroundFamily = new FamilyBuilder(world).include('Background').build()
  }

  @dependsOn({
    before: ['DrawSystem:update'],
    after: ['CameraSystem:update'],
  })
  public update(): void {
    const camera = getSingleton('Camera', this.world)
    const cameraPosition = camera.getComponent('Position')

    for (const background of this.backgroundFamily.entityIterator) {
      const bgComponent = background.getComponent('Background')
      const cameraDiff = cameraPosition.sub(new Vec2(0, bgComponent.horizontalY))
      const draw = background.getComponent('Draw')

      const [bgSprite] = draw.children as TilingSprite[]
      bgSprite.position.set(cameraPosition.x, cameraPosition.y)
      const scrollOffsetX = -cameraDiff.x * bgComponent.scrollSpeed.x
      const scrollOffsetY = -cameraDiff.y * bgComponent.scrollSpeed.y
      const minScrollOffsetY = (-bgSprite.height + windowSize.height) / 2
      const maxScrollOffsetY = (bgSprite.height - windowSize.height) / 2
      bgSprite.tilePosition.set(
        scrollOffsetX,
        // 縦方向にループさせないため、上限と下限をいい感じにする
        Math.max(minScrollOffsetY, Math.min(maxScrollOffsetY, scrollOffsetY))
      )
    }
  }
}
