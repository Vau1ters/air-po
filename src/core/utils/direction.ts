import { strEnum } from './enum'

const Directions = [
  'Right',
  'RightRightDown',
  'RightDown',
  'RightDownDown',
  'Down',
  'LeftDownDown',
  'LeftDown',
  'LeftLeftDown',
  'Left',
  'LeftLeftUp',
  'LeftUp',
  'LeftUpUp',
  'Up',
  'RightUpUp',
  'RightUp',
  'RightRightUp',
]

const DirectionDef = strEnum(Directions)

export type Direction = keyof typeof DirectionDef

export const calcDirection = (angle: number): Direction => {
  const radAngle = (angle / Math.PI) * 180
  const index = Math.floor(((radAngle + 360 + 180 / 16) / 360) * 16) % 16
  return Directions[index]
}
