/*+.† NOTIFICATION †.+*/
// this file is automatically written by soundtool.
// you can update this file by type "yarn soundtool" command.

// IMPORT
import snibeeDie from '@res/sound/snibeeDie.ogg'
import snibee from '@res/sound/snibee.ogg'
import shot from '@res/sound/shot.ogg'
import playerWalk from '@res/sound/playerWalk.ogg'
import playerLanding from '@res/sound/playerLanding.ogg'
import playerJump from '@res/sound/playerJump.ogg'
import playerHit from '@res/sound/playerHit.ogg'
import foot from '@res/sound/foot.ogg'
import fire from '@res/sound/fire.ogg'
import enemyHit from '@res/sound/enemyHit.ogg'
import dandelionShot from '@res/sound/dandelionShot.ogg'
import danball from '@res/sound/danball.ogg'
import burner from '@res/sound/burner.ogg'
import airJet from '@res/sound/airJet.ogg'

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
  soundStore.snibeeDie = await load(snibeeDie)
  soundStore.snibee = await load(snibee)
  soundStore.shot = await load(shot)
  soundStore.playerWalk = await load(playerWalk)
  soundStore.playerLanding = await load(playerLanding)
  soundStore.playerJump = await load(playerJump)
  soundStore.playerHit = await load(playerHit)
  soundStore.foot = await load(foot)
  soundStore.fire = await load(fire)
  soundStore.enemyHit = await load(enemyHit)
  soundStore.dandelionShot = await load(dandelionShot)
  soundStore.danball = await load(danball)
  soundStore.burner = await load(burner)
  soundStore.airJet = await load(airJet)
}
