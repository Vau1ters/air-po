import { System } from '../ecs/system'
import { World } from '../ecs/world'
import { PositionComponent } from '../components/positionComponent'
import { windowSize, application } from '../../core/application'
import { Container } from 'pixi.js'

export default class CameraSystem extends System {
  private stage: Container
  private drawContainer: Container
  public chaseTarget: PositionComponent = new PositionComponent()

  public constructor(world: World, stage: Container, drawContainer: Container) {
    super(world)
    this.stage = stage
    this.drawContainer = drawContainer
  }

  public update(): void {
    this.stage.position.set(
      windowSize.width / 2 - this.chaseTarget.x,
      windowSize.height / 2 - this.chaseTarget.y
    )
    this.drawContainer.filterArea = application.screen
  }
}
