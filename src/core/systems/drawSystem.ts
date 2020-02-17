import { System } from '../ecs/system'
import { FamilyBuilder, Family } from '../ecs/family'
import { World } from '../ecs/world'
import Graphics from '../graphics'
import { PositionComponent } from '../components/positionComponent'

export default class DrawSystem extends System {
  private family: Family
  public constructor(world: World) {
    super(world)

    this.family = new FamilyBuilder(world).include('Position').build()
  }
  public update(): void {
    Graphics.graphics.clear()
    for (const entity of this.family.entities) {
      const position = entity.getComponent('Position') as PositionComponent
      Graphics.graphics.beginFill(0xff0000)
      Graphics.graphics.drawRect(position.x - 10, position.y - 10, 20, 20)
    }
    Graphics.graphics.endFill()
  }
}
