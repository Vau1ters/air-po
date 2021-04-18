import { Behaviour } from './behaviour'
import { repeat } from './repeat'

export const loop = (fun: (frame: number) => void): Behaviour<void> => repeat(Infinity, fun)
