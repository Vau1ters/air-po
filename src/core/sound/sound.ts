// IMPORT
import snibee from '@res/sound/snibee.wav'
import shot from '@res/sound/shot.wav'
import jump from '@res/sound/jump.wav'
import foot from '@res/sound/foot.wav'
import PIXI from 'pixi-sound'

export const soundStore: { [key: string]: PIXI.Sound } = {}
export const play = (name: string): void => {
  const sound = soundStore[name]
  if (sound !== undefined) sound.play()
}

const load = (url: string): Promise<PIXI.Sound> => {
  return new Promise((resolve, reject) => {
    PIXI.Sound.from({
      url: url,
      preload: true,
      loaded: (err, sound) => {
        if (err) {
          reject()
        } else {
          resolve(sound)
        }
      },
    })
  })
}

export const init = async (): Promise<void> => {
  // LOAD_RESOURCE
  soundStore.snibee = await load(snibee)
  soundStore.shot = await load(shot)
  soundStore.jump = await load(jump)
  soundStore.foot = await load(foot)
}
