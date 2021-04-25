import { Entity } from '@core/ecs/entity'
import { Vec2 } from '@core/math/vec2'

export class PlayerComponent {
  public landing = false
  public pickupTarget = new Set<Entity>()
  public possessingEntity: Entity | undefined = undefined
  public throughFloorIgnoreCount = 0
  public targetPosition = new Vec2()
  public lastRespawnFlag?: Entity
}
