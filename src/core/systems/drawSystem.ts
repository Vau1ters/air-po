import { System } from '../ecs/system'
import { Family, FamilyBuilder } from '../ecs/family'
import { World } from '../ecs/world'
import { Container } from 'pixi.js'
import { Entity } from '../ecs/entity'
import { windowSize } from '../../core/application'
import { AABB } from '../math/aabb'
import { Vec2 } from '../math/vec2'
import { BVH } from '../physics/bvh'

export default class DrawSystem extends System {
  private drawFamily: Family
  private staticDrawFamily: Family
  private dynamicDrawFamily: Family
  private cameraFamily: Family

  private preVisibleEntities: Entity[] = []
  private container: Container = new Container()
  private dynamicBVH: BVH
  private staticBVH: BVH
  private staticBVHInitialized = false

  public constructor(world: World, stage: Container) {
    super(world)

    stage.addChild(this.container)

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
    this.cameraFamily = new FamilyBuilder(world).include('Camera').build()

    this.dynamicBVH = new BVH()
    this.staticBVH = new BVH()
  }

  public onContainerAdded(entity: Entity): void {
    const container = entity.getComponent('Draw')
    this.container.addChild(container)
  }

  public onContainerRemoved(entity: Entity): void {
    if (entity.hasComponent('Draw')) {
      const container = entity.getComponent('Draw')
      this.container.removeChild(container)
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
    for (const camera of this.cameraFamily.entityIterator) {
      const screen = this.createScreenAABB(camera)
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
  }

  private createScreenAABB(camera: Entity): AABB {
    const sw = windowSize.width
    const sh = windowSize.height
    const cpos = camera.getComponent('Position')
    return new AABB(new Vec2(-sw / 2, -sh / 2).add(cpos), new Vec2(sw, sh))
  }
}
