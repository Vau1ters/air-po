import { Texture } from 'pixi.js'
import { Animation } from '../graphics/animation'
import { textureStore } from '../graphics/art'
import { BehaviourNode } from './behaviourNode'
import { AnimationNode } from './action/animationNode'
import { DeathNode } from './action/deathNode'
import { EmitAirNode } from './action/emitAirNode'
import { MoveNode, Direction } from './action/moveNode'
import { PlayerGunShootNode } from './action/playerGunShootNode'
import { PlayerMoveNode } from './action/playerMoveNode'
import { WaitNode } from './action/waitNode'
import { ParallelNode } from './composite/parallelNode'
import { SequenceNode } from './composite/sequenceNode'
import { TrueNode, FalseNode } from './condition/boolNode'
import { IsDeadNode } from './condition/isDeadNode'
import { IfNode } from './decorator/ifNode'
import { WhileNode } from './decorator/whileNode'
import { assert } from '../../utils/assertion'

/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-use-before-define */

export function parseAI(json: any): { sprite: Animation; ai: BehaviourNode } {
  checkMembers(json, { sprite: 'any', ai: 'any' }, 'root component')
  const sprite = parseSprite(json.sprite)
  const ai = parseAINode(sprite, json.ai)
  return { sprite, ai }
}

function parseSprite(json: any): Animation {
  checkMembers(json, { name: 'string', state: 'any', default: 'string' }, 'sprite')

  const name = json.name
  if (!textureStore[name]) throw new Error(`"${name}" is not contained in textureStore`)

  const state: { [key: string]: number[] } = json.state

  const defaultState = json['default']
  if (!state[defaultState]) throw new Error(`"${defaultState}" is not contained in state`)

  const textures = textureStore[name]
  const animatedTexture: { [key: string]: Array<Texture> } = {}
  for (const stateName of Object.keys(state)) {
    const indices = state[stateName]
    animatedTexture[stateName] = indices.map(i => textures[i])
  }
  return new Animation(animatedTexture, defaultState)
}

function parseAINode(sprite: Animation, json: any): BehaviourNode {
  assert(Object.keys(json).length === 1)
  const name = Object.keys(json)[0]
  const body = json[name]
  switch (name) {
    case 'animation':
      return parseAnimationNode(body)
    case 'death':
      return parseDeathNode(body)
    case 'emitAir':
      return parseEmitAirNode(body)
    case 'move':
      return parseMoveNode(body)
    case 'playerGunShoot':
      return parsePlayerGunShootNode(body)
    case 'playerMove':
      return parsePlayerMoveNode(body)
    case 'wait':
      return parseWaitNode(body)
    case 'parallel':
      return parseParallelNode(sprite, body)
    case 'sequence':
      return parseSequenceNode(sprite, body)
    case 'true':
      return parseTrueNode(body)
    case 'false':
      return parseFalseNode(body)
    case 'isDead':
      return parseIsDeadNode(body)
    case 'if':
      return parseIfNode(sprite, body)
    case 'while':
      return parseWhileNode(sprite, body)
    default:
      throw new Error(`Unknown node name "${name}" is found`)
  }
}

function parseAnimationNode(json: any): AnimationNode {
  checkMembers(json, { state: 'string' }, 'animation')
  return new AnimationNode(json.state)
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

function parseWaitNode(json: any): WaitNode {
  checkMembers(json, { interval: 'number' }, 'wait')
  return new WaitNode(json.interval)
}

function parseParallelNode(sprite: Animation, json: any): ParallelNode {
  checkMembers(json, { body: 'array' }, 'parallel')
  return new ParallelNode(json.body.map((b: any) => parseAINode(sprite, b)))
}

function parseSequenceNode(sprite: Animation, json: any): SequenceNode {
  checkMembers(json, { body: 'array' }, 'sequence')
  return new SequenceNode(json.body.map((b: any) => parseAINode(sprite, b)))
}

function parseTrueNode(json: any): TrueNode {
  checkMembers(json, {}, 'true')
  return new TrueNode()
}

function parseFalseNode(json: any): FalseNode {
  checkMembers(json, {}, 'false')
  return new FalseNode()
}

function parseIsDeadNode(json: any): IsDeadNode {
  checkMembers(json, {}, 'isDeath')
  return new IsDeadNode()
}

function parseIfNode(sprite: Animation, json: any): IfNode {
  checkMembers(json, { condition: 'any', true: 'any', false: 'any' }, 'if')
  return new IfNode(
    parseAINode(sprite, json.condition),
    parseAINode(sprite, json.true),
    parseAINode(sprite, json.false)
  )
}

function parseWhileNode(sprite: Animation, json: any): WhileNode {
  checkMembers(json, { condition: 'any', body: 'any' }, 'while')
  return new WhileNode(parseAINode(sprite, json.condition), parseAINode(sprite, json.body))
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

function checkMembers(
  json: any,
  nameList: { [key: string]: 'number' | 'string' | 'array' | 'any' },
  nameOfThis: string
): void {
  for (const name of Object.keys(nameList)) {
    if (!json[name]) {
      throw new Error(`"${name}" is not contained in ${nameOfThis}`)
    }
    const type = nameList[name]
    switch (type) {
      case 'number':
        if (typeof json[name] !== 'number')
          throw new Error(`typeof ${name} in ${nameOfThis} must be number`)
        break
      case 'string':
        if (typeof json[name] !== 'string')
          throw new Error(`typeof ${name} in ${nameOfThis} must be string`)
        break
      case 'array':
        if (!(json[name] instanceof Array))
          throw new Error(`typeof ${name} in ${nameOfThis} must be array`)
        break
      case 'any':
        break
    }
  }
  for (const name of Object.keys(json)) {
    if (!Object.keys(nameList).includes(name)) {
      throw new Error(`Unknown member "${name}" is found in ${nameOfThis}`)
    }
  }
}
