import { System } from '../ecs/system'
import { FamilyBuilder, Family } from '../ecs/family'
import { World } from '../ecs/world'
import { Graphics, Container } from 'pixi.js'
import { AABBCollider, CircleCollider } from '../components/colliderComponent'
import { BVHLeaf, BVHNode } from '../components/bvhComponent'
import { windowSize } from '../application'
import { assert } from '../../utils/assertion'
import { AABB } from '../math/aabb'
import { Vec2 } from '../math/vec2'

export default class DebugDrawSystem extends System {
  private state = {
    position: true,
    collider: true,
    bvh: false,
  }

  private positionFamily: Family
  private colliderFamily: Family
  private bvhFamily: Family
  private cameraFamily: Family

  private graphics: Graphics = new Graphics()

  public constructor(world: World, container: Container) {
    super(world)

    this.positionFamily = new FamilyBuilder(world).include('Position').build()
    this.colliderFamily = new FamilyBuilder(world).include('Position', 'Collider').build()
    this.bvhFamily = new FamilyBuilder(world).include('BVH').build()
    this.cameraFamily = new FamilyBuilder(world).include('Camera').build()

    container.addChild(this.graphics)
  }

  public update(): void {
    this.graphics.clear()

    // 表示領域のみ描画して最適化
    let cameraPosition: { x: number; y: number } | undefined = undefined
    for (const camera of this.cameraFamily.entityIterator) {
      const position = camera.getComponent('Position')
      cameraPosition = {
        x: position.x,
        y: position.y,
      }
    }
    assert(cameraPosition != undefined)
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
      for (const entity of this.bvhFamily.entityIterator) {
        // webGLの頂点数上限に引っかからないようにnative: trueにしている
        this.graphics.lineStyle(1, 0xff0000, 1, 0.5, true)
        const bvh = entity.getComponent('BVH')

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
