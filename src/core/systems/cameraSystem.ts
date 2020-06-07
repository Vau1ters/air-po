import { System } from '../ecs/system'
import { World } from '../ecs/world'
import { PositionComponent } from '../components/positionComponent'
import { windowSize } from '../../core/application'
import { Container } from 'pixi.js'
import { Family, FamilyBuilder } from '../ecs/family'
import { assert } from '../../utils/assertion'

export default class CameraSystem extends System {
  private stage: Container

  private cameraFamily: Family

  public constructor(world: World, stage: Container) {
    super(world)
    this.stage = stage

    this.cameraFamily = new FamilyBuilder(world).include('Camera').build()
  }

  public update(): void {
    for (const camera of this.cameraFamily.entityIterator) {
      const position = camera.getComponent('Position')
      assert(position instanceof PositionComponent)
      this.stage.position.set(
        windowSize.width / 2 - position.x,
        windowSize.height / 2 - position.y
      )
    }
  }
}
