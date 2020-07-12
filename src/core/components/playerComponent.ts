import { Entity } from '../ecs/entity'

export class PlayerComponent {
  public landing = false
  public pickupTarget: Entity | null = null
  public possessingEntity: Entity | null = null
  public bulletAngle = 0
}
