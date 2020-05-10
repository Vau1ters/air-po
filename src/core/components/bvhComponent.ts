import { AABB } from '../math/aabb'
import { Collider } from './colliderComponent'
import { PositionComponent } from './positionComponent'

type Axis = 'x' | 'y'

const other = (axis: Axis): Axis => {
  return axis === 'x' ? 'y' : 'x'
}

export class BVHLeaf {
  private collider: Collider

  public constructor(collider: Collider) {
    this.collider = collider
  }

  public query(bound: AABB): Collider[] {
    if (this.bound.overlap(bound)) return [this.collider]
    return []
  }

  public get bound(): AABB {
    const position = this.collider.component.entity.getComponent(
      'Position'
    ) as PositionComponent
    return this.collider.bound.add(position)
  }
}

export class BVHNode {
  public readonly child: (BVHNode | BVHLeaf)[]
  public readonly bound: AABB

  public constructor(child: (BVHNode | BVHLeaf)[]) {
    this.child = child
    this.bound = child.map(c => c.bound).reduce((a, b) => a.merge(b))
  }

  public query(bound: AABB): Collider[] {
    if (!this.bound.overlap(bound)) return []
    return this.child.map(c => c.query(bound)).flat()
  }
}

export class BVHComponent {
  public root?: BVHNode | BVHLeaf

  public query(bound: AABB): Collider[] {
    if (!this.root) return []
    return this.root.query(bound)
  }

  public build(colliders: Collider[]): void {
    const leafList = colliders.map(c => new BVHLeaf(c))
    const root = BVHComponent.fromBoundsImpl(leafList, 'x')
    if (root) this.root = root
  }

  private static fromBoundsImpl(
    leafList: BVHLeaf[],
    axis: Axis
  ): BVHNode | BVHLeaf | undefined {
    if (leafList.length === 0) return undefined
    if (leafList.length === 1) return leafList[0]
    leafList = leafList.sort((a, b) =>
      Math.sign(a.bound.center[axis] - b.bound.center[axis])
    )
    const left = BVHComponent.fromBoundsImpl(
      leafList.slice(0, leafList.length >> 1),
      other(axis)
    )
    const right = BVHComponent.fromBoundsImpl(
      leafList.slice(leafList.length >> 1),
      other(axis)
    )
    if (!left) {
      throw new Error('There are any bugs.')
    }
    if (!right) {
      throw new Error('There are any bugs.')
    }
    return new BVHNode([left, right])
  }
}
