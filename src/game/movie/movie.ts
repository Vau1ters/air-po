import { SpriteNameType } from '@core/graphics/art'
import { movieList } from './movieList.autogen'
import * as t from 'io-ts'

export type MovieName = keyof typeof movieList

export const ActorNameType = t.string

export const MoviePositionType = t.intersection([
  t.type({
    baseName: ActorNameType,
  }),
  t.partial({
    offset: t.tuple([t.number, t.number]),
  }),
])

export const BlackActionTypeType = t.union([t.literal('in'), t.literal('out')])

export const BlackActionType = t.type({
  action: t.literal('black'),
  type: BlackActionTypeType,
})

export const CinemaScopeActionTypeType = t.union([t.literal('in'), t.literal('out')])

export const CinemaScopeActionType = t.type({
  action: t.literal('cinemaScope'),
  type: CinemaScopeActionTypeType,
})

export const CameraActionTypeType = t.union([t.literal('ease'), t.literal('warp')])

export const CameraActionType = t.type({
  action: t.literal('camera'),
  to: MoviePositionType,
  type: CameraActionTypeType,
  chase: t.boolean,
})

export const TalkActionType = t.type({
  action: t.literal('talk'),
  speaker: ActorNameType,
  content: t.string,
})

export const MoveActionTypeType = t.union([t.literal('walk'), t.literal('warp')])

export const MoveActionType = t.type({
  action: t.literal('move'),
  mover: ActorNameType,
  to: MoviePositionType,
  type: MoveActionTypeType,
})

export const JumpActionType = t.type({
  action: t.literal('jump'),
  mover: ActorNameType,
})

export const ShowSpriteActionType = t.type({
  action: t.literal('showSprite'),
  sprite: SpriteNameType,
  pos: MoviePositionType,
})

export const ThrowAirNadeActionType = t.type({
  action: t.literal('throwAirNade'),
  thrower: ActorNameType,
  to: MoviePositionType,
})

export const ActionType = t.union([
  BlackActionType,
  CinemaScopeActionType,
  CameraActionType,
  TalkActionType,
  MoveActionType,
  JumpActionType,
  ShowSpriteActionType,
  ThrowAirNadeActionType,
])

export const MovieType = t.type({
  participants: t.array(t.string),
  actions: t.array(ActionType),
})

export type Movie = t.TypeOf<typeof MovieType>
export type Action = t.TypeOf<typeof ActionType>
export type BlackAction = t.TypeOf<typeof BlackActionType>
export type BlackActionType = t.TypeOf<typeof BlackActionTypeType>
export type CinemaScopeAction = t.TypeOf<typeof CinemaScopeActionType>
export type CinemaScopeActionType = t.TypeOf<typeof CinemaScopeActionTypeType>
export type CameraAction = t.TypeOf<typeof CameraActionType>
export type CameraActionType = t.TypeOf<typeof CameraActionTypeType>
export type TalkAction = t.TypeOf<typeof TalkActionType>
export type MoveAction = t.TypeOf<typeof MoveActionType>
export type MoveActionType = t.TypeOf<typeof MoveActionTypeType>
export type JumpAction = t.TypeOf<typeof JumpActionType>
export type ShowSpriteAction = t.TypeOf<typeof ShowSpriteActionType>
export type ThrowAirNadeAction = t.TypeOf<typeof ThrowAirNadeActionType>
export type ActorName = t.TypeOf<typeof ActorNameType>
export type MoviePosition = t.TypeOf<typeof MoviePositionType>
