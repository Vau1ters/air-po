import { System } from '../ecs/system'
import { FamilyBuilder, Family } from '../ecs/family'
import { World } from '../ecs/world'
import { PositionComponent } from '../components/positionComponent'
import { Container } from 'pixi.js'
import { AirFilter } from '../../filters/airFilter'
import { AirComponent } from '../components/airComponent'
import { CircleCollider } from '../components/colliderComponent'
import { windowSize } from '../application'

export class AirSystem extends System {
  private family: Family

  private filter: AirFilter

  public constructor(world: World, container: Container) {
    super(world)

    this.family = new FamilyBuilder(world).include('Air', 'Position').build()

    this.filter = new AirFilter({ x: windowSize.width, y: windowSize.height })

    container.filters = [this.filter]
  }

  public update(): void {
    const airs = []
    for (const entity of this.family.entities) {
      const air = entity.getComponent('Air') as AirComponent
      const position = entity.getComponent('Position') as PositionComponent

      const radius = Math.sqrt(air.quantity)

      airs.push({
        center: position,
        radius,
      })

      const airCollider = entity.getComponent('Collider')
      if (airCollider) {
        for (const collider of airCollider.colliders) {
          if (collider instanceof CircleCollider) {
            collider.circle.radius = Math.sqrt(air.quantity)
          }
        }
      }
    }
    this.filter.airs = airs
  }
}
