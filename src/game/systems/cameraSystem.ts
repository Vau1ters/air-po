import { System } from '../ecs/system'
import { World } from '../ecs/world'
import { windowSize } from '../../core/application'
import { Container } from 'pixi.js'
import { Family, FamilyBuilder } from '../ecs/family'

export default class CameraSystem extends System {
  private target: Container
  private ignore: Container

  private cameraFamily: Family

  public constructor(world: World, target: Container, ignore: Container) {
    super(world)
    this.target = target
    this.ignore = ignore

    this.cameraFamily = new FamilyBuilder(world).include('Camera').build()
  }

  public update(): void {
    for (const camera of this.cameraFamily.entityIterator) {
      const position = camera.getComponent('Position')
      const offsetX = windowSize.width / 2 - position.x
      const offsetY = windowSize.height / 2 - position.y
      this.target.position.set(+offsetX, +offsetY)
      this.ignore.position.set(-offsetX, -offsetY)
    }
  }
}
