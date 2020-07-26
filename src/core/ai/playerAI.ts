import { animationNode } from './action/animationNode'
import { waitNode } from './action/waitNode'
import { deathNode } from './action/deathNode'
import { playerGunShootNode } from './action/playerGunShootNode'
import { playerMoveNode } from './action/playerMoveNode'
import { playerJetNode } from './action/playerJetNode'
import { whileNode } from './decorator/whileNode'
import { sequenceNode, parallelNode } from './composite/compositeNode'
import { isAliveNode } from './condition/isDeadNode'

export const playerAI = sequenceNode([
  whileNode(isAliveNode, parallelNode([playerGunShootNode, playerMoveNode, playerJetNode])),
  animationNode('Dying'),
  waitNode(60),
  deathNode,
])
