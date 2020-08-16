import { Entity } from '../ecs/entity'

export class PlayerComponent {
  public landing = false
  public pickupTarget = new Set<Entity>()
  public possessingEntity: Entity | undefined = undefined
  public bulletAngle = 0
}
