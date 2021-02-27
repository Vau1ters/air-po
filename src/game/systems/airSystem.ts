import { System } from '@core/ecs/system'
import { Entity } from '@core/ecs/entity'
import { FamilyBuilder, Family } from '@core/ecs/family'
import { World } from '@core/ecs/world'
import { PositionComponent } from '@game/components/positionComponent'
import { Category, CategorySet } from '@game/entities/category'
import { buildCollider, ColliderComponent } from '@game/components/colliderComponent'

export class AirSystem extends System {
  private family: Family

  private entity: Entity

  public static readonly AIR_SHRINK_QUANTITY_THRESHOLD = 10
  private static readonly AIR_SHRINK_QUANTITY_SPEED = 0.3

  public constructor(world: World) {
    super(world)

    this.family = new FamilyBuilder(world).include('Air', 'Position').build()

    this.entity = new Entity()

    const collider = new ColliderComponent()
    collider.colliders.push(
      buildCollider({
        entity: this.entity,
        geometry: {
          type: 'Air',
          world,
        },
        category: Category.AIR,
        mask: new CategorySet(Category.SENSOR),
        tag: ['air'],
        isSensor: true,
      })
    )
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
}
