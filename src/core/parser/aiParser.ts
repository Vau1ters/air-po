import { BehaviourNode } from '../ai/behaviourNode'
import { AnimationNode } from '../ai/action/animationNode'
import { BalloonVineChaseNode } from '../ai/action/balloonVineChaseNode'
import { DeathNode } from '../ai/action/deathNode'
import { EmitAirNode } from '../ai/action/emitAirNode'
import { MoveNode, Direction } from '../ai/action/moveNode'
import { PlayerGunShootNode } from '../ai/action/playerGunShootNode'
import { PlayerMoveNode } from '../ai/action/playerMoveNode'
import { PlayerPickupNode } from '../ai/action/playerPickupNode'
import { WaitNode } from '../ai/action/waitNode'
import { ParallelNode } from '../ai/composite/parallelNode'
import { SequenceNode } from '../ai/composite/sequenceNode'
import { TrueNode, FalseNode } from '../ai/condition/boolNode'
import { IsDeadNode } from '../ai/condition/isDeadNode'
import { IsPossessedNode } from '../ai/condition/isPossessedNode'
import { IfNode } from '../ai/decorator/ifNode'
import { WhileNode } from '../ai/decorator/whileNode'
import { assert, checkMembers } from '../../utils/assertion'
import { PlayerJetNode } from '../ai/action/playerJetNode'
import { RemoveComponentNode } from '../ai/action/removeComponentNode'
import { SelectNode } from '../ai/composite/selectNode'
import { HasAirNode } from '../ai/condition/hasAirNode'

/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-use-before-define */

export function parseAI(json: any): BehaviourNode {
  assert(Object.keys(json).length === 1)
  const name = Object.keys(json)[0]
  const body = json[name]
  switch (name) {
    // action
    case 'animation':
      return parseAnimationNode(body)
    case 'balloonVineChase':
      return parseBalloonVineChaseNode(body)
    case 'death':
      return parseDeathNode(body)
    case 'emitAir':
      return parseEmitAirNode(body)
    case 'move':
      return parseMoveNode(body)
    case 'playerGunShoot':
      return parsePlayerGunShootNode(body)
    case 'playerJet':
      return parsePlayerJetNode(body)
    case 'playerMove':
      return parsePlayerMoveNode(body)
    case 'playerPickup':
      return parsePlayerPickupNode(body)
    case 'removeComponent':
      return parseRemoveComponentNode(body)
    case 'wait':
      return parseWaitNode(body)
    // composite
    case 'parallel':
      return parseParallelNode(body)
    case 'sequence':
      return parseSequenceNode(body)
    case 'select':
      return parseSelectNode(body)
    // condition
    case 'true':
      return parseTrueNode(body)
    case 'false':
      return parseFalseNode(body)
    case 'hasAir':
      return parseHasAirNode(body)
    case 'isDead':
      return parseIsDeadNode(body)
    case 'isPossessed':
      return parseIsPossessedNode(body)
    // decorator
    case 'if':
      return parseIfNode(body)
    case 'while':
      return parseWhileNode(body)
    default:
      throw new Error(`Unknown node name "${name}" is found`)
  }
}

function parseAnimationNode(json: any): AnimationNode {
  checkMembers(json, { state: 'string' }, 'animation')
  return new AnimationNode(json.state)
}

function parseBalloonVineChaseNode(json: any): BalloonVineChaseNode {
  checkMembers(json, {}, 'balloonVineChase')
  return new BalloonVineChaseNode()
}

function parseDeathNode(json: any): DeathNode {
  checkMembers(json, {}, 'death')
  return new DeathNode()
}

function parseEmitAirNode(json: any): EmitAirNode {
  checkMembers(json, { quantity: 'number' }, 'emitAir')
  return new EmitAirNode(json.quantity)
}

function parseMoveNode(json: any): MoveNode {
  checkMembers(json, { direction: 'string', speed: 'number', interval: 'number' }, 'move')
  return new MoveNode(parseDirection(json.direction), json.speed, json.interval)
}

function parsePlayerGunShootNode(json: any): PlayerGunShootNode {
  checkMembers(json, {}, 'playerGunShoot')
  return new PlayerGunShootNode()
}

function parsePlayerMoveNode(json: any): PlayerMoveNode {
  checkMembers(json, {}, 'playerMove')
  return new PlayerMoveNode()
}

function parsePlayerPickupNode(json: any): PlayerPickupNode {
  checkMembers(json, {}, 'playerPickup')
  return new PlayerPickupNode()
}

function parsePlayerJetNode(json: any): PlayerJetNode {
  checkMembers(json, {}, 'playerJet')
  return new PlayerJetNode()
}

function parseRemoveComponentNode(json: any): RemoveComponentNode {
  checkMembers(json, { component: 'string' }, 'removeComponent')
  return new RemoveComponentNode(json.component)
}

function parseWaitNode(json: any): WaitNode {
  checkMembers(json, { interval: 'number' }, 'wait')
  return new WaitNode(json.interval)
}

function parseParallelNode(json: any): ParallelNode {
  checkMembers(json, { body: 'array' }, 'parallel')
  return new ParallelNode(json.body.map((b: any) => parseAI(b)))
}

function parseSequenceNode(json: any): SequenceNode {
  checkMembers(json, { body: 'array' }, 'sequence')
  return new SequenceNode(json.body.map((b: any) => parseAI(b)))
}

function parseSelectNode(json: any): SelectNode {
  checkMembers(json, { body: 'array' }, 'select')
  return new SelectNode(json.body.map((b: any) => parseAI(b)))
}

function parseTrueNode(json: any): TrueNode {
  checkMembers(json, {}, 'true')
  return new TrueNode()
}

function parseFalseNode(json: any): FalseNode {
  checkMembers(json, {}, 'false')
  return new FalseNode()
}

function parseHasAirNode(json: any): HasAirNode {
  checkMembers(json, {}, 'hasAir')
  return new HasAirNode()
}

function parseIsDeadNode(json: any): IsDeadNode {
  checkMembers(json, {}, 'isDeath')
  return new IsDeadNode()
}

function parseIsPossessedNode(json: any): IsPossessedNode {
  checkMembers(json, {}, 'isPossessed')
  return new IsPossessedNode()
}

function parseIfNode(json: any): IfNode {
  checkMembers(json, { condition: 'any', true: 'any', false: 'any' }, 'if')
  return new IfNode(parseAI(json.condition), parseAI(json.true), parseAI(json.false))
}

function parseWhileNode(json: any): WhileNode {
  checkMembers(json, { condition: 'any', body: 'any' }, 'while')
  return new WhileNode(parseAI(json.condition), parseAI(json.body))
}

function parseDirection(json: string): Direction {
  switch (json) {
    case 'Left':
      return Direction.Left
    case 'Right':
      return Direction.Right
    default:
      throw new Error(`Unknown string "${json}" is found in direction`)
  }
}
