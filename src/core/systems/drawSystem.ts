import { System } from '../ecs/system'
import { FamilyBuilder, Family } from '../ecs/family'
import { World } from '../ecs/world'
import { PositionComponent } from '../components/positionComponent'
import { Graphics } from 'pixi.js'

export default class DrawSystem extends System {
  private family: Family

  private graphics: Graphics

  public constructor(world: World, graphics: Graphics) {
    super(world)

    this.family = new FamilyBuilder(world).include('Position').build()

    this.graphics = graphics
  }
  public update(): void {
    this.graphics.clear()
    for (const entity of this.family.entities) {
      const position = entity.getComponent('Position') as PositionComponent
      this.graphics.beginFill(0xff0000)
      this.graphics.drawRect(position.x - 10, position.y - 10, 20, 20)
    }
    this.graphics.endFill()
  }
}
