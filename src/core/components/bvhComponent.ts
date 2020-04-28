import { AABB } from '../math/aabb'
import { Collider } from './colliderComponent'
import { PositionComponent } from './positionComponent'

const enum Axis {
  X = 'x',
  Y = 'y',
}

function other(axis: Axis): Axis {
  if (axis === Axis.X) return Axis.Y
  else return Axis.X
}

export class BVHLeaf {
  private collider: Collider

  constructor(collider: Collider) {
    this.collider = collider
  }

  query(bound: AABB): Collider[] {
    if (this.bound.overlap(bound)) return [this.collider]
    return []
  }

  get bound(): AABB {
    const position = this.collider.component.entity.getComponent(
      'Position'
    ) as PositionComponent
    return this.collider.bound.add(position)
  }
}

export class BVHNode {
  readonly child: (BVHNode | BVHLeaf)[]
  readonly bound: AABB

  constructor(child: (BVHNode | BVHLeaf)[]) {
    this.child = child
    this.bound = child.map(c => c.bound).reduce((a, b) => a.merge(b))
  }

  query(bound: AABB): Collider[] {
    if (!this.bound.overlap(bound)) return []
    return this.child.map(c => c.query(bound)).reduce((a, b) => a.concat(b))
  }
}

export class BVHComponent {
  root?: BVHNode | BVHLeaf

  query(bound: AABB): Collider[] {
    if (!this.root) return []
    return this.root.query(bound)
  }

  build(colliders: Collider[]): void {
    const leafList = colliders.map(c => new BVHLeaf(c))
    const root = BVHComponent.fromBoundsImpl(leafList, Axis.X)
    if (root) this.root = root
  }

  private static fromBoundsImpl(
    leafList: BVHLeaf[],
    axis: Axis
  ): BVHNode | BVHLeaf | null {
    if (leafList.length === 0) return null
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
