import { System } from '@core/ecs/system'
import { FamilyBuilder, Family } from '@core/ecs/family'
import { World } from '@core/ecs/world'
import { Graphics, Container } from 'pixi.js'
import { AABBCollider, CircleCollider } from '@game/components/colliderComponent'
import { windowSize } from '@core/application'
import { AABB } from '@core/collision/aabb'
import { Vec2 } from '@core/math/vec2'
import PhysicsSystem from './physicsSystem'
import { BVHLeaf, BVHNode } from '@core/collision/bvh'

export default class DebugDrawSystem extends System {
  private state = {
    position: false,
    collider: false,
    bvh: false,
  }

  private positionFamily: Family
  private colliderFamily: Family
  private cameraFamily: Family

  private physicsSystem: PhysicsSystem
  private graphics: Graphics = new Graphics()

  public constructor(world: World, container: Container, physicsSystem: PhysicsSystem) {
    super(world)

    this.positionFamily = new FamilyBuilder(world).include('Position').build()
    this.colliderFamily = new FamilyBuilder(world).include('Position', 'Collider').build()
    this.cameraFamily = new FamilyBuilder(world).include('Camera').build()

    this.physicsSystem = physicsSystem

    container.addChild(this.graphics)
  }

  public update(): void {
    this.graphics.clear()

    // 表示領域のみ描画して最適化
    if (this.cameraFamily.entityArray.length === 0) return
    const [camera] = this.cameraFamily.entityArray
    const cameraPosition = camera.getComponent('Position')
    const cameraX = cameraPosition.x - windowSize.width / 2
    const cameraY = cameraPosition.y - windowSize.height / 2
    const cameraW = windowSize.width
    const cameraH = windowSize.height
    const cameraArea = new AABB(new Vec2(cameraX, cameraY), new Vec2(cameraW, cameraH))

    if (this.state.position) {
      this.graphics.beginFill(0xff0000)
      for (const entity of this.positionFamily.entityIterator) {
        const position = entity.getComponent('Position')
        if (cameraArea.contains(position)) {
          this.graphics.drawRect(position.x - 1, position.y - 1, 2, 2)
        }
      }
      this.graphics.endFill()
    }

    if (this.state.collider) {
      this.graphics.beginFill(0x00ffff, 0.5)
      for (const entity of this.colliderFamily.entityIterator) {
        const position = entity.getComponent('Position')
        const collider = entity.getComponent('Collider')

        for (const c of collider.colliders) {
          if (c instanceof AABBCollider) {
            const pos = position.add(c.aabb.position)
            if (cameraArea.overlap(new AABB(pos, c.aabb.size))) {
              this.graphics.drawRect(pos.x, pos.y, c.aabb.size.x, c.aabb.size.y)
            }
          } else if (c instanceof CircleCollider) {
            const pos = position.add(c.circle.position)
            if (cameraArea.overlap(new AABB(pos, new Vec2(c.circle.radius, c.circle.radius)))) {
              this.graphics.drawCircle(pos.x, pos.y, c.circle.radius)
            }
          }
        }
      }
      this.graphics.endFill()
    }

    if (this.state.bvh) {
      for (const [_, bvh] of this.physicsSystem.bvhs) {
        // webGLの頂点数上限に引っかからないようにnative: trueにしている
        this.graphics.lineStyle(1, 0xff0000, 1, 0.5, true)

        const draw = (n: BVHNode | BVHLeaf): void => {
          const b = n.bound
          if (cameraArea.overlap(b)) {
            this.graphics.drawRect(b.position.x, b.position.y, b.size.x, b.size.y)
          }
          if (n instanceof BVHNode) {
            for (const c of n.child) draw(c)
          }
        }

        if (bvh.root) draw(bvh.root)
        this.graphics.endFill()
      }
    }
  }
}
