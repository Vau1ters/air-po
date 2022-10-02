import { AABB } from './geometry/AABB'
import { ReservedArray } from '@utils/reservedArray'
import { Collider } from '@game/components/colliderComponent'
import { Segment } from './geometry/segment'
import { collideSegmentAABB } from './collision/Segment_AABB'

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

  public querySegment(ray: Segment, result: ReservedArray<Collider>): void {
    if (!collideSegmentAABB(ray, this.bound).hit) return
    result.push(this.collider)
  }

  public get bound(): AABB {
    const position = this.collider.entity.getComponent('Position')
    return this.collider.bound.add(position)
  }
}

export class BVHNode {
  public _childA: BVHNode | BVHLeaf
  public _childB: BVHNode | BVHLeaf
  public _bound: AABB

  public constructor(childA: BVHNode | BVHLeaf, childB: BVHNode | BVHLeaf) {
    this._childA = childA
    this._childB = childB
    this._bound = childA.bound.merge(childB.bound)
  }

  public reconstruct(childA: BVHNode | BVHLeaf, childB: BVHNode | BVHLeaf) {
    this._childA = childA
    this._childB = childB
    this._bound = childA.bound.merge(childB.bound)
  }

  public get childA(): BVHNode | BVHLeaf {
    return this._childA
  }

  public get childB(): BVHNode | BVHLeaf {
    return this._childB
  }

  public get bound(): AABB {
    return this._bound
  }

  public query(bound: AABB, result: ReservedArray<Collider>): void {
    if (!this.bound.overlap(bound)) return
    this._childA.query(bound, result)
    this._childB.query(bound, result)
  }

  public querySegment(ray: Segment, result: ReservedArray<Collider>): void {
    if (!collideSegmentAABB(ray, this.bound).hit) return
    this._childA.querySegment(ray, result)
    this._childB.querySegment(ray, result)
  }
}

export class BVH {
  public root?: BVHNode | BVHLeaf
  private pool: BVHNode[]
  private count: number

  public constructor() {
    this.pool = new Array<BVHNode>()
    this.count = 0
  }

  public query(bound: AABB): Collider[] {
    const result = new ReservedArray<Collider>(100)
    if (this.root) {
      this.root.query(bound, result)
    }
    return result.toArray()
  }

  public querySegment(ray: Segment): Collider[] {
    const result = new ReservedArray<Collider>(100)
    if (this.root) {
      this.root.querySegment(ray, result)
    }
    return result.toArray()
  }

  public build(colliders: Collider[]): void {
    const leafList = colliders.map(c => c.bvhLeaf)
    this.count = 0
    const root = this.fromBoundsImpl(leafList, 'x')
    this.root = root
  }

  private getNode(childA: BVHNode | BVHLeaf, childB: BVHNode | BVHLeaf): BVHNode {
    if (this.count < this.pool.length) {
      const node = this.pool[this.count++]
      node.reconstruct(childA, childB)
      return node
    } else {
      this.pool.push(new BVHNode(childA, childB))
      const node = this.pool[this.count++]
      return node
    }
  }

  private fromBoundsImpl(leafList: BVHLeaf[], axis: Axis): BVHNode | BVHLeaf | undefined {
    if (leafList.length === 0) return undefined
    if (leafList.length === 1) return leafList[0]
    leafList = leafList.sort((a, b) => a.bound.center[axis] - b.bound.center[axis])

    const other = (axis: Axis): Axis => (axis === 'x' ? 'y' : 'x')
    const left = this.fromBoundsImpl(leafList.slice(0, leafList.length >> 1), other(axis))
    const right = this.fromBoundsImpl(leafList.slice(leafList.length >> 1), other(axis))
    if (!left) {
      throw new Error('There are any bugs.')
    }
    if (!right) {
      throw new Error('There are any bugs.')
    }
    return this.getNode(left, right)
  }
}
