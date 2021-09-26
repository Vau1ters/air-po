import { Entity } from '@core/ecs/entity'
import { Vec2 } from '@core/math/vec2'

export class PlayerComponent {
  public landing = false
  public possessingEntity: Entity | undefined = undefined
  public throughFloorIgnoreCount = 0
  public targetPosition = new Vec2()
  public spawnerID = 0
  public hasShot = false // for Weapon Background UI
  public coinCount = {
    small: 0,
    large: 0,
  }
}
