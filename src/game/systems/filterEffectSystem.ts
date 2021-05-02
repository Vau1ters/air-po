import { windowSize } from '@core/application'
import { Family, FamilyBuilder } from '@core/ecs/family'
import { System, dependsOn } from '@core/ecs/system'
import { World } from '@core/ecs/world'
import { isAlive } from '@game/ai/entity/common/condition/isAlive'
import { DeathEffectFilter } from '@game/filters/deathEffectFilter'
import { Container } from 'pixi.js'

export class FilterEffectSystem extends System {
  private playerFamily: Family
  private deathEffectFilter: DeathEffectFilter

  public constructor(world: World, container: Container) {
    super(world)

    this.playerFamily = new FamilyBuilder(world).include('Player').build()
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
    const [player] = this.playerFamily.entityArray
    const isPlayerAlive = isAlive(player)
    if (!isPlayerAlive()) {
      this.deathEffectFilter.update()
    }
  }
}
