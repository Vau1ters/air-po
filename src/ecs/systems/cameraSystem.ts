import { System } from '../system'
import { World } from '../world'
import { windowSize } from '../../application'
import { Container } from 'pixi.js'
import { Family, FamilyBuilder } from '../family'

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
