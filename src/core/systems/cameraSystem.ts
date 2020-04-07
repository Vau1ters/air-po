import { System } from '../ecs/system'
import { World } from '../ecs/world'
import { PositionComponent } from '../components/positionComponent'
import { application, windowSize } from '../../core/application'

export default class CameraSystem extends System {
  public chaseTarget: PositionComponent

  public constructor(world: World) {
    super(world)
    this.chaseTarget = new PositionComponent()
  }

  public update(): void {
    if (!this.chaseTarget) return
    const s = application.stage.scale
    application.stage.position.set(
      s.x * (windowSize.width / 2 - this.chaseTarget.x),
      s.y * (windowSize.height / 2 - this.chaseTarget.y)
    )
  }
}
