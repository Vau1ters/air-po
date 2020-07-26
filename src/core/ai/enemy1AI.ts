import { whileNode } from './decorator/whileNode'
import { sequenceNode } from './composite/compositeNode'
import { Direction, moveNode } from './action/moveNode'
import { animationNode } from './action/animationNode'
import { waitNode } from './action/waitNode'
import { emitAirNode } from './action/emitAirNode'
import { deathNode } from './action/deathNode'
import { isAliveNode } from './condition/isDeadNode'

export const enemy1AI = sequenceNode([
  whileNode(
    isAliveNode,
    sequenceNode([moveNode(Direction.Right, 2, 60), moveNode(Direction.Left, 2, 60)])
  ),
  animationNode('Dying'),
  waitNode(60),
  emitAirNode(50),
  deathNode,
])
