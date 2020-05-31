import { System } from '../ecs/system'
import { Family, FamilyBuilder } from '../ecs/family'
import { World } from '../ecs/world'
import { Container, Graphics } from 'pixi.js'
import { AirHolderComponent } from '../components/airHolderComponent'
import { windowSize } from '../application'
import { HPComponent } from '../components/hpComponent'

export default class UiSystem extends System {
  private playerFamily: Family

  private container: Container = new Container()

  private hpGauge: Graphics = new Graphics()
  private airGauge: Graphics = new Graphics()

  public constructor(world: World, stage: Container) {
    super(world)

    this.hpGauge.position.set(0, 0)
    this.container.addChild(this.hpGauge)
    this.airGauge.position.set(0, 16)
    this.container.addChild(this.airGauge)

    stage.addChild(this.container)

    this.playerFamily = new FamilyBuilder(world).include('Player').build()
  }

  public update(): void {
    for (const player of this.playerFamily.entityIterator) {
      const hp = player.getComponent('HP') as HPComponent
      this.hpGauge.clear()
      this.hpGauge.beginFill(0x30ff60)
      this.hpGauge.drawRect(0, 0, (hp.hp / hp.maxHp) * windowSize.width, 16)
      this.hpGauge.endFill()

      const holder = player.getComponent('AirHolder') as AirHolderComponent
      this.airGauge.clear()
      this.airGauge.beginFill(0x3080ff)
      this.airGauge.drawRect(
        0,
        0,
        (holder.currentQuantity / holder.maxQuantity) * windowSize.width,
        16
      )
      this.airGauge.endFill()
    }
  }
}
