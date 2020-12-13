import { System } from '@core/ecs/system'
import { Family, FamilyBuilder } from '@core/ecs/family'
import { World } from '@core/ecs/world'
import { AABBCollider } from '@game/components/colliderComponent'

export default class FlameSystem extends System {
  private family: Family

  public constructor(world: World) {
    super(world)

    this.family = new FamilyBuilder(world).include('Flame').build()
  }

  public update(): void {
    for (const entity of this.family.entityIterator) {
      const { size, graphic } = entity.getComponent('Flame')
      const colliders = entity.getComponent('Collider').colliders as Array<AABBCollider>

      graphic.clear()
      graphic.beginFill(this.mixColor((16 - size) / 14))
      graphic.drawRect(-size / 2, -size / 2, size, size)
      graphic.endFill()

      for (const collider of colliders) {
        if (collider.tag.has('AttackHitBox') || collider.tag.has('airHolderBody')) {
          collider.aabb.size.x = size
          collider.aabb.size.y = size
          collider.aabb.position.x = -size / 2
          collider.aabb.position.y = -size / 2
        }
      }
    }
  }

  private mixColor(temp: number): number {
    return 0xff0000 + Math.floor(0xff * temp) * 0x100 + 0x44 * temp
  }
}
