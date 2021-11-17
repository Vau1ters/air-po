import { System } from '@core/ecs/system'
import { Family, FamilyBuilder } from '@core/ecs/family'
import { World } from '@core/ecs/world'
import { Container } from 'pixi.js'
import { Entity } from '@core/ecs/entity'
import { windowSize } from '@core/application'
import { AABB } from '@core/collision/geometry/AABB'
import { Vec2 } from '@core/math/vec2'
import { BVH } from '@core/collision/bvh'
import { getSingleton } from './singletonSystem'
import { ContainerType } from '@game/entities/loader/component/DrawComponentLoader'

export default class DrawSystem extends System {
  private drawFamily: Family
  private staticDrawFamily: Family
  private dynamicDrawFamily: Family

  private preVisibleEntities: Entity[] = []
  private dynamicBVH: BVH
  private staticBVH: BVH
  private staticBVHInitialized = false

  public constructor(
    world: World,
    private worldContainer: Container,
    private worldUIContainer: Container,
    private uiContainer: Container
  ) {
    super(world)

    this.drawFamily = new FamilyBuilder(world).include('Draw').build()

    for (const entity of this.drawFamily.entityIterator) {
      this.onContainerAdded(entity)
    }
    this.drawFamily.entityAddedEvent.addObserver(entity => this.onContainerAdded(entity))
    this.drawFamily.entityRemovedEvent.addObserver(entity => this.onContainerRemoved(entity))

    this.staticDrawFamily = new FamilyBuilder(world)
      .include('Draw')
      .include('Static')
      .build()
    this.dynamicDrawFamily = new FamilyBuilder(world)
      .include('Draw')
      .exclude('Static')
      .build()

    this.dynamicBVH = new BVH()
    this.staticBVH = new BVH()
  }

  public init(): void {
    this.dynamicBVH = new BVH()
    this.staticBVH = new BVH()
    this.preVisibleEntities = []
    this.staticBVHInitialized = false
  }

  public onContainerAdded(entity: Entity): void {
    const draw = entity.getComponent('Draw')
    this.getContainer(draw.type).addChild(draw)
  }

  public onContainerRemoved(entity: Entity): void {
    const draw = entity.getComponent('Draw')
    this.getContainer(draw.type).removeChild(draw)
  }

  private getContainer(type: ContainerType): Container {
    switch (type) {
      case 'World':
        return this.worldContainer
      case 'WorldUI':
        return this.worldUIContainer
      case 'UI':
        return this.uiContainer
    }
  }

  public update(): void {
    this.resetVisibility()
    this.updateBVH()
    this.updateAllState()
  }

  private resetVisibility(): void {
    for (const e of this.preVisibleEntities) {
      e.getComponent('Draw').visible = false
    }
    this.preVisibleEntities = []
  }

  private updateBVH(): void {
    if (!this.staticBVHInitialized) {
      this.staticBVHInitialized = true
      this.staticBVH.build(
        this.staticDrawFamily.entityArray.map(e => e.getComponent('Draw').createCollider())
      )
    }

    this.dynamicBVH.build(
      this.dynamicDrawFamily.entityArray.map(e => e.getComponent('Draw').createCollider())
    )
  }

  private updateAllState(): void {
    const screen = this.createScreenAABB()
    const visibleEntities = [this.dynamicBVH, this.staticBVH]
      .map(bvh => bvh.query(screen))
      .reduce((a, b) => Array.prototype.concat(a, b))
      .map(c => c.entity)
    for (const entity of visibleEntities) {
      const position = entity.getComponent('Position')
      const container = entity.getComponent('Draw')
      container.visible = true
      container.position.set(position.x, position.y)
      this.preVisibleEntities.push(entity)
    }
  }

  private createScreenAABB(): AABB {
    const camera = getSingleton('Camera', this.world)
    const sw = windowSize.width
    const sh = windowSize.height
    const cpos = camera.getComponent('Position')
    return new AABB(cpos.copy(), new Vec2(sw, sh))
  }
}
