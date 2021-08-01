import { Family, FamilyBuilder } from '@core/ecs/family'
import { System } from '@core/ecs/system'
import { World } from '@core/ecs/world'
import { Container, Graphics } from 'pixi.js'

export class HPSystem extends System {
  private hpFamily: Family

  private hpGauge: Graphics = new Graphics()

  public constructor(world: World, worldContainer: Container) {
    super(world)
    this.hpGauge.position.set(0)
    worldContainer.addChild(this.hpGauge)

    this.hpFamily = new FamilyBuilder(world).include('Hp', 'Position').build()
  }

  public update(): void {
    this.hpGauge.clear()
    this.hpGauge.beginFill(0x30ff70)
    for (const entity of this.hpFamily.entityIterator) {
      const hp = entity.getComponent('Hp')
      const position = entity.getComponent('Position')
      this.hpGauge.drawRect(position.x - 8, position.y - 12, hp.ratio * 16, 2)
    }
    this.hpGauge.endFill()
  }
}
