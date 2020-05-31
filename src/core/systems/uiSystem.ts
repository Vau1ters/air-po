import { System } from '../ecs/system'
import { Family, FamilyBuilder } from '../ecs/family'
import { World } from '../ecs/world'
import { Container, Graphics } from 'pixi.js'
import { AirHolderComponent } from '../components/airHolderComponent'
import { windowSize } from '../application'
import { HPComponent } from '../components/hpComponent'
import { assert } from '../../utils/assertion'
import { PositionComponent } from '../components/positionComponent'

export default class UiSystem extends System {
  private playerFamily: Family
  private hpFamily: Family

  private uiContainer: Container = new Container()
  private gameWorldUiContainer: Container = new Container()

  private hpGauge: Graphics = new Graphics()
  private playerHpGauge: Graphics = new Graphics()
  private playerAirGauge: Graphics = new Graphics()

  public constructor(
    world: World,
    uiContainer: Container,
    gameWorldUiContainer: Container
  ) {
    super(world)

    this.hpGauge.position.set(0)
    this.gameWorldUiContainer.addChild(this.hpGauge)
    this.playerHpGauge.position.set(0, 0)
    this.uiContainer.addChild(this.playerHpGauge)
    this.playerAirGauge.position.set(0, 16)
    this.uiContainer.addChild(this.playerAirGauge)

    uiContainer.addChild(this.uiContainer)
    gameWorldUiContainer.addChild(this.gameWorldUiContainer)

    this.playerFamily = new FamilyBuilder(world).include('Player').build()
    this.hpFamily = new FamilyBuilder(world).include('HP', 'Position').build()
  }

  public update(): void {
    for (const player of this.playerFamily.entityIterator) {
      const hp = player.getComponent('HP')
      assert(hp instanceof HPComponent)
      this.playerHpGauge.clear()
      this.playerHpGauge.beginFill(0x30ff70)
      this.playerHpGauge.drawRect(
        0,
        0,
        (hp.hp / hp.maxHp) * windowSize.width,
        16
      )
      this.playerHpGauge.endFill()

      const holder = player.getComponent('AirHolder') as AirHolderComponent
      this.playerAirGauge.clear()
      this.playerAirGauge.beginFill(0x3080ff)
      this.playerAirGauge.drawRect(
        0,
        0,
        (holder.currentQuantity / holder.maxQuantity) * windowSize.width,
        16
      )
      this.playerAirGauge.endFill()
    }

    this.hpGauge.clear()
    this.hpGauge.beginFill(0x30ff70)
    for (const entity of this.hpFamily.entityIterator) {
      const hp = entity.getComponent('HP') as HPComponent
      const position = entity.getComponent('Position') as PositionComponent
      this.hpGauge.drawRect(
        position.x - 8,
        position.y - 12,
        (hp.hp / hp.maxHp) * 16,
        2
      )
    }
    this.hpGauge.endFill()
  }
}
