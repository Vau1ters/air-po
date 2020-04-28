import { System } from '../ecs/system'
import { FamilyBuilder, Family } from '../ecs/family'
import { World } from '../ecs/world'
import { PositionComponent } from '../components/positionComponent'
import { BVHLeaf, BVHNode, BVHComponent } from '../components/bvhComponent'
import { Graphics, Container } from 'pixi.js'

export default class DebugDrawSystem extends System {
  private positionFamily: Family
  private bvhFamily: Family

  private graphics: Graphics = new Graphics()

  public constructor(world: World, container: Container) {
    super(world)

    this.positionFamily = new FamilyBuilder(world).include('Position').build()
    this.bvhFamily = new FamilyBuilder(world).include('BVH').build()

    container.addChild(this.graphics)
  }

  public update(): void {
    this.graphics.clear()
    for (const entity of this.positionFamily.entities) {
      const position = entity.getComponent('Position') as PositionComponent
      this.graphics.beginFill(0xff0000)
      this.graphics.drawRect(position.x - 1, position.y - 1, 2, 2)
    }
    for (const entity of this.bvhFamily.entities) {
      const bvh = entity.getComponent('BVH') as BVHComponent

      const draw = (n: BVHNode | BVHLeaf): void => {
        const b = n.bound
        this.graphics.drawRect(b.position.x, b.position.y, b.size.x, b.size.y)
        if (n instanceof BVHNode) {
          for (const c of n.child) draw(c)
        }
      }

      this.graphics.lineStyle(1, 0xff0000)
      this.graphics.beginFill(0xffffff, 0)
      if (bvh.root) draw(bvh.root)
    }
    this.graphics.endFill()
  }
}
