import { Entity } from '../../ecs/entity'
import { BehaviourNode, NodeState } from '../behaviourNode'
import { Vec2 } from '../../math/vec2'

export class BalloonVineChaseNode implements BehaviourNode {
  private v = new Vec2(0, 0)

  public initState(): void {
    // empty
  }

  public execute(entity: Entity): NodeState {
    const player = entity.getComponent('PlayerPointer').player
    if (!player) return NodeState.Failure
    const pp = player.getComponent('Position').add(new Vec2(0, -20))
    const p = entity.getComponent('Position')
    const r = p.sub(pp)
    const l = r.length()
    const nr = r.normalize()
    const vr = this.v.dot(nr)

    const l0 = 2
    const k = 0.01
    const c = 0.1
    const d = 0.1
    const ml = 10

    const ar = -k * (l - l0) - c * vr

    this.v = this.v.add(nr.mul(ar))
    this.v = this.v.mul(1 - d)

    let np = p.add(this.v)
    const nl = np.sub(pp).length()
    if (nl > ml) {
      np = pp.add(np.sub(pp).mul(ml / nl))
    }
    this.v = np.sub(p)

    p.x += this.v.x
    p.y += this.v.y
    return NodeState.Running
  }
}
