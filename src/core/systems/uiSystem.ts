import { System } from '../ecs/system'
import { Family, FamilyBuilder } from '../ecs/family'
import { World } from '../ecs/world'
import { Container, Graphics } from 'pixi.js'
import { windowSize } from '../application'
import { MouseController } from './controlSystem'
import { Vec2 } from '../math/vec2'

export default class UiSystem extends System {
  private playerFamily: Family
  private hpFamily: Family

  private uiContainer: Container = new Container()
  private gameWorldUiContainer: Container = new Container()

  private hpGauge: Graphics = new Graphics()
  private playerHpGauge: Graphics = new Graphics()
  private playerAirGauge: Graphics = new Graphics()
  private laserSight: Graphics = new Graphics()

  public constructor(world: World, uiContainer: Container, gameWorldUiContainer: Container) {
    super(world)

    this.hpGauge.position.set(0)
    this.gameWorldUiContainer.addChild(this.hpGauge)

    this.laserSight.position.set(0)
    this.uiContainer.addChild(this.laserSight)
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
      this.playerHpGauge.clear()
      this.playerHpGauge.beginFill(0x30ff70)
      this.playerHpGauge.drawRect(0, 0, (hp.hp / hp.maxHp) * windowSize.width, 16)
      this.playerHpGauge.endFill()

      const holder = player.getComponent('AirHolder')
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
      const hp = entity.getComponent('HP')
      const position = entity.getComponent('Position')
      this.hpGauge.drawRect(position.x - 8, position.y - 12, (hp.hp / hp.maxHp) * 16, 2)
    }
    this.hpGauge.endFill()

    const mousePosition = MouseController.position
    const mouseX = mousePosition.x
    const mouseY = mousePosition.y
    const direction = mousePosition.sub(new Vec2(windowSize.width / 2, windowSize.height / 2))
    const terminal = direction
      .normalize()
      .mul(direction.length() - 8)
      .add(new Vec2(windowSize.width / 2, windowSize.height / 2))
    this.laserSight.clear()
    this.laserSight.lineStyle(0.4, 0xff0000)
    this.laserSight.moveTo(windowSize.width / 2, windowSize.height / 2)
    this.laserSight.lineTo(terminal.x, terminal.y)
    this.laserSight.drawCircle(mouseX, mouseY, 8)
    this.laserSight.moveTo(mouseX - 2, mouseY)
    this.laserSight.lineTo(mouseX + 2, mouseY)
    this.laserSight.moveTo(mouseX, mouseY - 2)
    this.laserSight.lineTo(mouseX, mouseY + 2)
    this.laserSight.moveTo(mouseX - 8, mouseY)
    this.laserSight.lineTo(mouseX - 5, mouseY)
    this.laserSight.moveTo(mouseX + 5, mouseY)
    this.laserSight.lineTo(mouseX + 8, mouseY)
    this.laserSight.moveTo(mouseX, mouseY - 8)
    this.laserSight.lineTo(mouseX, mouseY - 5)
    this.laserSight.moveTo(mouseX, mouseY + 5)
    this.laserSight.lineTo(mouseX, mouseY + 8)
  }
}
