import { windowSize } from '@core/application'
import { System, dependsOn } from '@core/ecs/system'
import { World } from '@core/ecs/world'
import { isAlive } from '@game/ai/entity/common/condition/isAlive'
import { DeathEffectFilter } from '@game/filters/deathEffectFilter'
import { Container } from 'pixi.js'
import { getSingleton } from './singletonSystem'

export class FilterEffectSystem extends System {
  private deathEffectFilter: DeathEffectFilter

  public constructor(world: World, container: Container) {
    super(world)

    this.deathEffectFilter = new DeathEffectFilter(world, {
      x: windowSize.width,
      y: windowSize.height,
    })
    container.filters = [this.deathEffectFilter]
  }

  @dependsOn({
    after: ['CameraSystem:update'],
  })
  public update(): void {
    const player = getSingleton('Player', this.world)
    const isPlayerAlive = isAlive(player)
    if (!isPlayerAlive()) {
      this.deathEffectFilter.update()
    }
  }
}
