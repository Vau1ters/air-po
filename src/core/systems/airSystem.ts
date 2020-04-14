import { System } from '../ecs/system'
import { FamilyBuilder, Family } from '../ecs/family'
import { World } from '../ecs/world'
import { PositionComponent } from '../components/positionComponent'
import { Container } from 'pixi.js'
import { AirFilter } from '../../filters/airFilter'
import { AirComponent } from '../components/airComponent'

export class AirSystem extends System {
  private family: Family

  private filter: AirFilter

  public constructor(world: World, container: Container) {
    super(world)

    this.family = new FamilyBuilder(world).include('Air', 'Position').build()

    this.filter = new AirFilter({ x: 320, y: 240 })

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
    }
    this.filter.airs = airs
  }
}
