import { System } from '../ecs/system'
import { FamilyBuilder, Family } from '../ecs/family'
import { World } from '../ecs/world'
import { PositionComponent } from '../components/positionComponent'
import { Graphics, Container } from 'pixi.js'

export default class DebugDrawSystem extends System {
  private family: Family

  private graphics: Graphics = new Graphics()

  public constructor(world: World, container: Container) {
    super(world)

    this.family = new FamilyBuilder(world).include('Position').build()

    container.addChild(this.graphics)
  }

  public update(): void {
    this.graphics.clear()
    for (const entity of this.family.entities) {
      const position = entity.getComponent('Position') as PositionComponent
      this.graphics.beginFill(0xff0000)
      this.graphics.drawRect(position.x - 5, position.y - 5, 10, 10)
    }
    this.graphics.endFill()
  }
}
