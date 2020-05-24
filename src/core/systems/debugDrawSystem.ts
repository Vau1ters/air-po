import { System } from '../ecs/system'
import { FamilyBuilder, Family } from '../ecs/family'
import { World } from '../ecs/world'
import { PositionComponent } from '../components/positionComponent'
import { BVHLeaf, BVHNode, BVHComponent } from '../components/bvhComponent'
import { Graphics, Container } from 'pixi.js'
import {
  ColliderComponent,
  AABBCollider,
  CircleCollider,
} from '../components/colliderComponent'

export default class DebugDrawSystem extends System {
  private state = {
    position: true,
    collider: true,
    bvh: true,
  }

  private positionFamily: Family
  private colliderFamily: Family
  private bvhFamily: Family

  private graphics: Graphics = new Graphics()

  public constructor(world: World, container: Container) {
    super(world)

    this.positionFamily = new FamilyBuilder(world).include('Position').build()
    this.colliderFamily = new FamilyBuilder(world)
      .include('Position', 'Collider')
      .build()
    this.bvhFamily = new FamilyBuilder(world).include('BVH').build()

    container.addChild(this.graphics)
  }

  public update(): void {
    this.graphics.clear()

    if (this.state.position) {
      this.graphics.beginFill(0xff0000)
      for (const entity of this.positionFamily.entities) {
        const position = entity.getComponent('Position') as PositionComponent
        this.graphics.drawRect(position.x - 1, position.y - 1, 2, 2)
      }
      this.graphics.endFill()
    }

    if (this.state.collider) {
      this.graphics.beginFill(0x00ffff, 0.5)
      for (const entity of this.colliderFamily.entities) {
        const position = entity.getComponent('Position') as PositionComponent
        const collider = entity.getComponent('Collider') as ColliderComponent

        for (const c of collider.colliders) {
          if (c instanceof AABBCollider) {
            const pos = position.add(c.aabb.position)
            this.graphics.drawRect(pos.x, pos.y, c.aabb.size.x, c.aabb.size.y)
          } else if (c instanceof CircleCollider) {
            const pos = position.add(c.circle.position)
            this.graphics.drawCircle(pos.x, pos.y, c.circle.radius)
          }
        }
      }
      this.graphics.endFill()
    }

    if (this.state.bvh) {
      this.graphics.lineStyle(0.5, 0xff0000)
      this.graphics.beginFill(0xffffff, 0)
      for (const entity of this.bvhFamily.entities) {
        const bvh = entity.getComponent('BVH') as BVHComponent

        const draw = (n: BVHNode | BVHLeaf): void => {
          const b = n.bound
          this.graphics.drawRect(b.position.x, b.position.y, b.size.x, b.size.y)
          if (n instanceof BVHNode) {
            for (const c of n.child) draw(c)
          }
        }

        if (bvh.root) draw(bvh.root)
      }
      this.graphics.endFill()
    }
  }
}
