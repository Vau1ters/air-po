import { System } from '../ecs/system'
import { Family, FamilyBuilder } from '../ecs/family'
import { World } from '../ecs/world'
import { Container, Graphics } from 'pixi.js'
import { windowSize } from '../application'
import { MouseController } from './controlSystem'
import { Vec2 } from '../math/vec2'
import { Ray } from '../math/ray'
import { CategoryList } from '../entities/category'
import { Entity } from '../ecs/entity'
import PhysicsSystem from './physicsSystem'

export default class UiSystem extends System {
  private playerFamily: Family
  private hpFamily: Family

  private physicsSystem: PhysicsSystem

  private uiContainer: Container = new Container()
  private gameWorldUiContainer: Container = new Container()

  private hpGauge: Graphics = new Graphics()
  private playerHpGauge: Graphics = new Graphics()
  private playerAirGauge: Graphics = new Graphics()
  private laserSight: Graphics = new Graphics()

  public constructor(
    world: World,
    uiContainer: Container,
    gameWorldUiContainer: Container,
    physicsSystem: PhysicsSystem
  ) {
    super(world)

    this.physicsSystem = physicsSystem

    this.laserSight.position.set(0)
    this.gameWorldUiContainer.addChild(this.laserSight)
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
      this.renderPlayerHp(player)
      this.renderPlayerAir(player)
      this.renderLaserSight(player)
    }
    this.renderNpcHp()
  }

  private renderPlayerHp(player: Entity): void {
    const hp = player.getComponent('HP')
    this.playerHpGauge.clear()
    this.playerHpGauge.beginFill(0x30ff70)
    this.playerHpGauge.drawRect(0, 0, (hp.hp / hp.maxHp) * windowSize.width, 16)
    this.playerHpGauge.endFill()
  }

  private renderPlayerAir(player: Entity): void {
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

  private renderLaserSight(player: Entity): void {
    const position = player.getComponent('Position')
    const mousePosition = MouseController.position
    const direction = mousePosition.sub(new Vec2(windowSize.width / 2, windowSize.height / 2))
    const candidatePoints: Vec2[] = []
    for (const [category, bvh] of this.physicsSystem.bvhs) {
      if (
        CategoryList.bulletBody.mask.has(category) ||
        CategoryList.player.attack.mask.has(category)
      ) {
        const result = bvh.queryRaycast(new Ray(position, direction))
        candidatePoints.push(...result.map(item => item[1]))
      }
    }
    // candidatePointsが空配列だとエラーになるので、遠いところに点を置く
    const farPoint = position.add(
      direction.mul(
        Math.abs(Math.min(windowSize.width / direction.x, windowSize.height / direction.y))
      )
    )
    const hitPoint = candidatePoints.reduce((pre: Vec2, next: Vec2) => {
      if (position.sub(next).length() < position.sub(pre).length()) return next
      return pre
    }, farPoint)
    this.laserSight.clear()
    this.laserSight.lineStyle(0.5, 0xff0000)
    this.laserSight.moveTo(position.x, position.y)
    this.laserSight.lineTo(hitPoint.x, hitPoint.y)
    this.laserSight.beginFill(0xff0000)
    this.laserSight.drawCircle(hitPoint.x, hitPoint.y, 2)
  }

  private renderNpcHp(): void {
    this.hpGauge.clear()
    this.hpGauge.beginFill(0x30ff70)
    for (const entity of this.hpFamily.entityIterator) {
      const hp = entity.getComponent('HP')
      const position = entity.getComponent('Position')
      this.hpGauge.drawRect(position.x - 8, position.y - 12, (hp.hp / hp.maxHp) * 16, 2)
    }
    this.hpGauge.endFill()
  }
}
