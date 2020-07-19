import { BehaviourNode } from '../ai/behaviourNode'
import { AnimationNode } from '../ai/action/animationNode'
import { DeathNode } from '../ai/action/deathNode'
import { EmitAirNode } from '../ai/action/emitAirNode'
import { MoveNode, Direction } from '../ai/action/moveNode'
import { PlayerGunShootNode } from '../ai/action/playerGunShootNode'
import { PlayerMoveNode } from '../ai/action/playerMoveNode'
import { WaitNode } from '../ai/action/waitNode'
import { ParallelNode } from '../ai/composite/parallelNode'
import { SequenceNode } from '../ai/composite/sequenceNode'
import { TrueNode, FalseNode } from '../ai/condition/boolNode'
import { IsDeadNode } from '../ai/condition/isDeadNode'
import { IfNode } from '../ai/decorator/ifNode'
import { WhileNode } from '../ai/decorator/whileNode'
import { assert, checkMembers } from '../../utils/assertion'
import { PlayerJetNode } from '../ai/action/playerJetNode'
import { RemoveComponentNode } from '../ai/action/removeComponentNode'
import { SelectNode } from '../ai/composite/selectNode'
import { HasAirNode } from '../ai/condition/hasAirNode'
import { Entity } from '../ecs/entity'
import { World } from '../ecs/world'

/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-use-before-define */

export function parseAI(json: any, entity: Entity, world: World): BehaviourNode {
  assert(Object.keys(json).length === 1)
  const name = Object.keys(json)[0]
  const body = json[name]
  switch (name) {
    // action
    case 'animation':
      return parseAnimationNode(body, entity)
    case 'death':
      return parseDeathNode(body, entity, world)
    case 'emitAir':
      return parseEmitAirNode(body, entity, world)
    case 'move':
      return parseMoveNode(body, entity)
    case 'playerGunShoot':
      return parsePlayerGunShootNode(body, entity, world)
    case 'playerJet':
      return parsePlayerJetNode(body, entity)
    case 'playerMove':
      return parsePlayerMoveNode(body, entity)
    case 'removeComponent':
      return parseRemoveComponentNode(body, entity)
    case 'wait':
      return parseWaitNode(body)
    // composite
    case 'parallel':
      return parseParallelNode(body, entity, world)
    case 'sequence':
      return parseSequenceNode(body, entity, world)
    case 'select':
      return parseSelectNode(body, entity, world)
    // condition
    case 'true':
      return parseTrueNode(body)
    case 'false':
      return parseFalseNode(body)
    case 'hasAir':
      return parseHasAirNode(body, entity)
    case 'isDead':
      return parseIsDeadNode(body, entity)
    // decorator
    case 'if':
      return parseIfNode(body, entity, world)
    case 'while':
      return parseWhileNode(body, entity, world)
    default:
      throw new Error(`Unknown node name "${name}" is found`)
  }
}

function parseAnimationNode(json: any, entity: Entity): AnimationNode {
  checkMembers(json, { state: 'string' }, 'animation')
  return new AnimationNode(entity, json.state)
}

function parseDeathNode(json: any, entity: Entity, world: World): DeathNode {
  checkMembers(json, {}, 'death')
  return new DeathNode(entity, world)
}

function parseEmitAirNode(json: any, entity: Entity, world: World): EmitAirNode {
  checkMembers(json, { quantity: 'number' }, 'emitAir')
  return new EmitAirNode(entity, world, json.quantity)
}

function parseMoveNode(json: any, entity: Entity): MoveNode {
  checkMembers(json, { direction: 'string', speed: 'number', interval: 'number' }, 'move')
  return new MoveNode(entity, parseDirection(json.direction), json.speed, json.interval)
}

function parsePlayerGunShootNode(json: any, entity: Entity, world: World): PlayerGunShootNode {
  checkMembers(json, {}, 'playerGunShoot')
  return new PlayerGunShootNode(entity, world)
}

function parsePlayerMoveNode(json: any, entity: Entity): PlayerMoveNode {
  checkMembers(json, {}, 'playerMove')
  return new PlayerMoveNode(entity)
}

function parsePlayerJetNode(json: any, entity: Entity): PlayerJetNode {
  checkMembers(json, {}, 'playerJet')
  return new PlayerJetNode(entity)
}

function parseRemoveComponentNode(json: any, entity: Entity): RemoveComponentNode {
  checkMembers(json, { component: 'string' }, 'removeComponent')
  return new RemoveComponentNode(entity, json.component)
}

function parseWaitNode(json: any): WaitNode {
  checkMembers(json, { interval: 'number' }, 'wait')
  return new WaitNode(json.interval)
}

function parseParallelNode(json: any, entity: Entity, world: World): ParallelNode {
  checkMembers(json, { body: 'array' }, 'parallel')
  return new ParallelNode(json.body.map((b: any) => parseAI(b, entity, world)))
}

function parseSequenceNode(json: any, entity: Entity, world: World): SequenceNode {
  checkMembers(json, { body: 'array' }, 'sequence')
  return new SequenceNode(json.body.map((b: any) => parseAI(b, entity, world)))
}

function parseSelectNode(json: any, entity: Entity, world: World): SelectNode {
  checkMembers(json, { body: 'array' }, 'select')
  return new SelectNode(json.body.map((b: any) => parseAI(b, entity, world)))
}

function parseTrueNode(json: any): TrueNode {
  checkMembers(json, {}, 'true')
  return new TrueNode()
}

function parseFalseNode(json: any): FalseNode {
  checkMembers(json, {}, 'false')
  return new FalseNode()
}

function parseHasAirNode(json: any, entity: Entity): HasAirNode {
  checkMembers(json, {}, 'hasAir')
  return new HasAirNode(entity)
}

function parseIsDeadNode(json: any, entity: Entity): IsDeadNode {
  checkMembers(json, {}, 'isDeath')
  return new IsDeadNode(entity)
}

function parseIfNode(json: any, entity: Entity, world: World): IfNode {
  checkMembers(json, { condition: 'any', true: 'any', false: 'any' }, 'if')
  return new IfNode(
    parseAI(json.condition, entity, world),
    parseAI(json.true, entity, world),
    parseAI(json.false, entity, world)
  )
}

function parseWhileNode(json: any, entity: Entity, world: World): WhileNode {
  checkMembers(json, { condition: 'any', body: 'any' }, 'while')
  return new WhileNode(() => true, parseAI(json.body, entity, world))
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
