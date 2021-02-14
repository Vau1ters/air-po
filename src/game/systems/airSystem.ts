import { System } from '@core/ecs/system'
import { Entity } from '@core/ecs/entity'
import { FamilyBuilder, Family } from '@core/ecs/family'
import { World } from '@core/ecs/world'
import { PositionComponent } from '@game/components/positionComponent'
import { AirFilter } from '@game/filters/airFilter'
import { AirDef, ColliderComponent, AirCollider } from '@game/components/colliderComponent'
import { AABB } from '@core/collision/aabb'
import { Vec2 } from '@core/math/vec2'
import { assert } from '@utils/assertion'
import { CategoryList } from '@game/entities/category'

export class AirSystem extends System {
  private family: Family

  private entity: Entity

  public static readonly AIR_SHRINK_QUANTITY_THRESHOLD = 10
  private static readonly AIR_SHRINK_QUANTITY_SPEED = 0.3

  public constructor(world: World) {
    super(world)

    this.family = new FamilyBuilder(world).include('Air', 'Position').build()

    this.entity = new Entity()
    const collider = new ColliderComponent(this.entity)
    const air = new AirDef(this.family, CategoryList.air)
    air.tag.add('air')
    air.isSensor = true
    collider.createCollider(air)
    this.entity.addComponent('Collider', collider)
    this.entity.addComponent('Position', new PositionComponent())
  }

  public init(): void {
    this.world.addEntity(this.entity)
  }

  public update(): void {
    this.removeDeadAir()
    this.shrinkSmallAir()
    this.actualizeAir()
    this.updateBounds()
  }

  removeDeadAir(): void {
    for (const entity of this.family.entityIterator) {
      const air = entity.getComponent('Air')

      if (!air.alive) {
        this.world.removeEntity(entity)
        continue
      }
    }
  }

  shrinkSmallAir(): void {
    for (const entity of this.family.entityIterator) {
      const air = entity.getComponent('Air')
      if (air.quantity < AirSystem.AIR_SHRINK_QUANTITY_THRESHOLD) {
        air.decrease(AirSystem.AIR_SHRINK_QUANTITY_SPEED)
      }
    }
  }

  actualizeAir(): void {
    for (const entity of this.family.entityIterator) {
      const air = entity.getComponent('Air')
      air.actualize()
    }
  }

  updateBounds(): void {
    const airCollider = this.entity.getComponent('Collider').colliders[0]
    assert(airCollider instanceof AirCollider, 'Invalid collider')

    const aabbBounds: AABB[] = airCollider.airFamily.entityArray.map((e: Entity) => {
      const p = e.getComponent('Position')
      return new AABB(
        p.sub(new Vec2(AirFilter.EFFECTIVE_RADIUS, AirFilter.EFFECTIVE_RADIUS)),
        new Vec2(AirFilter.EFFECTIVE_RADIUS * 2, AirFilter.EFFECTIVE_RADIUS * 2)
      )
    })
    if (aabbBounds.length === 0) return
    airCollider.bound = aabbBounds.reduce((a, b) => a.merge(b))
  }
}
