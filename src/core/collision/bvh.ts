import { AABB } from '../math/aabb'
import { ReservedArray } from '../../utils/reservedArray'
import { Ray, raycastToAABB } from '../math/ray'
import { Vec2 } from '../math/vec2'
import { Collider } from '../components/colliderComponent'

type Axis = 'x' | 'y'

export class BVHLeaf {
  private collider: Collider

  public constructor(collider: Collider) {
    this.collider = collider
  }

  public query(bound: AABB, result: ReservedArray<Collider>): void {
    if (!this.bound.overlap(bound)) return
    result.push(this.collider)
  }

  public queryRaycast(ray: Ray, result: ReservedArray<[Collider, Vec2]>): void {
    const raycastResult = raycastToAABB(ray, this.bound)
    if (!raycastResult) return
    result.push([this.collider, raycastResult])
  }

  public get bound(): AABB {
    const position = this.collider.entity.getComponent('Position')
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

  public query(bound: AABB, result: ReservedArray<Collider>): void {
    if (!this.bound.overlap(bound)) return
    for (const c of this.child) {
      c.query(bound, result)
    }
  }

  public queryRaycast(ray: Ray, result: ReservedArray<[Collider, Vec2]>): void {
    const raycastResult = raycastToAABB(ray, this.bound)
    if (!raycastResult) return
    for (const c of this.child) {
      c.queryRaycast(ray, result)
    }
  }
}

export class BVH {
  public root?: BVHNode | BVHLeaf

  public query(bound: AABB): Collider[] {
    const result = new ReservedArray<Collider>(100)
    if (this.root) {
      this.root.query(bound, result)
    }
    return result.toArray()
  }

  public queryRaycast(ray: Ray): [Collider, Vec2][] {
    const result = new ReservedArray<[Collider, Vec2]>(100)
    if (this.root) {
      this.root.queryRaycast(ray, result)
    }
    return result.toArray()
  }

  public build(colliders: Collider[]): void {
    const leafList = colliders.map(c => new BVHLeaf(c))
    const root = BVH.fromBoundsImpl(leafList, 'x')
    this.root = root
  }

  private static fromBoundsImpl(leafList: BVHLeaf[], axis: Axis): BVHNode | BVHLeaf | undefined {
    if (leafList.length === 0) return undefined
    if (leafList.length === 1) return leafList[0]
    leafList = leafList.sort((a, b) => a.bound.center[axis] - b.bound.center[axis])

    const other = (axis: Axis): Axis => (axis === 'x' ? 'y' : 'x')
    const left = BVH.fromBoundsImpl(leafList.slice(0, leafList.length >> 1), other(axis))
    const right = BVH.fromBoundsImpl(leafList.slice(leafList.length >> 1), other(axis))
    if (!left) {
      throw new Error('There are any bugs.')
    }
    if (!right) {
      throw new Error('There are any bugs.')
    }
    return new BVHNode([left, right])
  }
}
