import { System } from '@core/ecs/system'
import { Family, FamilyBuilder } from '@core/ecs/family'
import { World } from '@core/ecs/world'
import { Container, Graphics } from 'pixi.js'
import { windowSize } from '@core/application'
import { Entity } from '@core/ecs/entity'

export default class UiSystem extends System {
  private playerFamily: Family
  private hpFamily: Family

  private uiContainer: Container = new Container()
  private gameWorldUiContainer: Container = new Container()

  private hpGauge: Graphics = new Graphics()
  private playerHpGauge: Graphics = new Graphics()
  private playerAirGauge: Graphics = new Graphics()

  public constructor(world: World, uiContainer: Container, gameWorldUiContainer: Container) {
    super(world)

    this.hpGauge.position.set(0)
    this.gameWorldUiContainer.addChild(this.hpGauge)

    this.playerHpGauge.position.set(0, 0)
    this.uiContainer.addChild(this.playerHpGauge)
    this.playerAirGauge.position.set(6, 20)
    this.uiContainer.addChild(this.playerAirGauge)

    uiContainer.addChild(this.uiContainer)
    gameWorldUiContainer.addChild(this.gameWorldUiContainer)

    this.playerFamily = new FamilyBuilder(world).include('Player').build()
    this.hpFamily = new FamilyBuilder(world).include('HP', 'Position').build()
  }

  public update(): void {
    for (const player of this.playerFamily.entityIterator) {
      this.renderPlayerHp(player)
      this.renderPlayerAir(player)
    }
    this.renderNpcHp()
  }

  private renderPlayerHp(player: Entity): void {
    const hp = player.getComponent('HP')
    this.playerHpGauge.clear()
    this.playerHpGauge.beginFill(0x30ff70)
    this.playerHpGauge.drawRect(0, 0, hp.ratio * windowSize.width, 16)
    this.playerHpGauge.endFill()
  }

  private static airGaugeUiSetting = {
    width: 10,
    height: 24,
    paddingRight: 6,
    paddingTop: 0,
  }

  private renderPlayerAir(player: Entity): void {
    const holder = player.getComponent('AirHolder')
    const airTank = player.getComponent('Equipment').airTank

    this.playerAirGauge.clear()
    for (let i = 0; i < airTank.count; i++) {
      // 枠
      this.playerAirGauge.lineStyle(1, 0xffffff, 1, 1)
      this.playerAirGauge.drawRect(
        (UiSystem.airGaugeUiSetting.paddingRight + UiSystem.airGaugeUiSetting.width) * i,
        UiSystem.airGaugeUiSetting.paddingTop,
        UiSystem.airGaugeUiSetting.width,
        UiSystem.airGaugeUiSetting.height
      )

      // 割合計算
      const rate = Math.max(
        0,
        Math.min(1, (holder.quantity - airTank.quantity * i) / airTank.quantity)
      )
      // ゲージ
      this.playerAirGauge.lineStyle()
      this.playerAirGauge.beginFill(0x3080ff)
      this.playerAirGauge.drawRect(
        (UiSystem.airGaugeUiSetting.paddingRight + UiSystem.airGaugeUiSetting.width) * i,
        UiSystem.airGaugeUiSetting.paddingTop + (1 - rate) * UiSystem.airGaugeUiSetting.height,
        UiSystem.airGaugeUiSetting.width,
        rate * UiSystem.airGaugeUiSetting.height
      )
      this.playerAirGauge.endFill()
    }
  }

  private renderNpcHp(): void {
    this.hpGauge.clear()
    this.hpGauge.beginFill(0x30ff70)
    for (const entity of this.hpFamily.entityIterator) {
      const hp = entity.getComponent('HP')
      const position = entity.getComponent('Position')
      this.hpGauge.drawRect(position.x - 8, position.y - 12, hp.ratio * 16, 2)
    }
    this.hpGauge.endFill()
  }
}
