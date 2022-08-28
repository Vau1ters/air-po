import { System } from '@core/ecs/system'
import { Entity } from '@core/ecs/entity'
import { FamilyBuilder, Family } from '@core/ecs/family'
import { World } from '@core/ecs/world'
import { PositionComponent } from '@game/components/positionComponent'
import { buildCollider, ColliderComponent } from '@game/components/colliderComponent'
import { AirComponent } from '@game/components/airComponent'

export const AIR_TAG = 'Air'

export class AirSystem extends System {
  private family: Family

  private entity: Entity

  public static readonly AIR_SHRINK_RADIUS_THRESHOLD = 10
  public static readonly AIR_SHRINK_QUANTITY_THRESHOLD =
    AirSystem.AIR_SHRINK_RADIUS_THRESHOLD / AirComponent.QUANTITY_RADIUS_RATE
  private static readonly AIR_SHRINK_QUANTITY_SPEED = 3

  public constructor(world: World) {
    super(world)

    this.family = new FamilyBuilder(world).include('Air', 'Position').build()

    this.entity = new Entity()

    this.entity.addComponent(
      'Collider',
      new ColliderComponent(
        buildCollider({
          entity: this.entity,
          geometry: {
            type: 'Air',
            world,
          },
          category: 'air',
          tag: [AIR_TAG],
        })
      )
    )
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
