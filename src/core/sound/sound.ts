import shot from '../../../res/sound/shot.wav'
import snibee from '../../../res/sound/snibee.wav'
import PIXI from 'pixi-sound'

export const soundStore: { [key: string]: PIXI.Sound } = {}
export const play = (name: string): void => {
  const sound = soundStore[name]
  console.assert(sound !== undefined)
  sound.play()
}
export const init = (): void => {
  soundStore.shot = PIXI.Sound.from(shot)
  soundStore.snibee = PIXI.Sound.from(snibee)
}
