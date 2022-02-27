import { dependsOn, System } from '@core/ecs/system'
import { World } from '@core/ecs/world'
import { windowSize } from '@core/application'
import { Container } from 'pixi.js'
import { getSingleton } from './singletonSystem'

export default class CameraSystem extends System {
  private target: Container

  public constructor(world: World, target: Container) {
    super(world)
    this.target = target
  }

  @dependsOn({
    after: ['Camera:AI'],
  })
  public update(): void {
    const camera = getSingleton('Camera', this.world)
    const position = camera.getComponent('Position')
    const offsetX = windowSize.width / 2 - position.x
    const offsetY = windowSize.height / 2 - position.y
    this.target.position.set(Math.floor(offsetX), Math.floor(offsetY))
  }
}
