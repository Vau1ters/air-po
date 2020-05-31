import { System } from '../ecs/system'
import { Family, FamilyBuilder } from '../ecs/family'
import { World } from '../ecs/world'
import { Container, Graphics } from 'pixi.js'
import { AirHolderComponent } from '../components/airHolderComponent'
import { windowSize } from '../application'

export default class UiSystem extends System {
  private playerFamily: Family

  private container: Container = new Container()

  private airGauge: Graphics = new Graphics()

  public constructor(world: World, stage: Container) {
    super(world)

    this.airGauge.position.set(0, 16)
    this.container.addChild(this.airGauge)

    stage.addChild(this.container)

    this.playerFamily = new FamilyBuilder(world).include('Player').build()
  }

  public update(): void {
    for (const player of this.playerFamily.entityIterator) {
      const holder = player.getComponent('AirHolder') as AirHolderComponent
      this.airGauge.clear()
      this.airGauge.beginFill(0x3090ff)
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
