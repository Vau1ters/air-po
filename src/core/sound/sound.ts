/*+.† NOTIFICATION †.+*/
// this file is automatically written by soundtool.
// you can update this file by type "yarn soundtool" command.

// IMPORT
import snibeeDie from '@res/sound/snibeeDie.wav'
import snibee from '@res/sound/snibee.wav'
import shot from '@res/sound/shot.wav'
import playerWalk from '@res/sound/playerWalk.wav'
import playerLanding from '@res/sound/playerLanding.wav'
import playerJump from '@res/sound/playerJump.wav'
import playerHit from '@res/sound/playerHit.wav'
import jump from '@res/sound/jump.wav'
import getAirTank from '@res/sound/getAirTank.wav'
import foot from '@res/sound/foot.wav'
import fire from '@res/sound/fire.wav'
import enemyHit from '@res/sound/enemyHit.wav'
import dandelionShot from '@res/sound/dandelionShot.wav'
import danball from '@res/sound/danball.wav'
import burner from '@res/sound/burner.wav'
import airTankBecameEmpty from '@res/sound/airTankBecameEmpty.wav'
import airJet from '@res/sound/airJet.wav'

import PIXI from 'pixi-sound'

export const soundStore: { [key: string]: PIXI.Sound } = {}
export const play = (name: string, options?: PIXI.Options): void => {
  const sound = soundStore[name]
  if (sound !== undefined) sound.play(options)
}

const load = (url: string, options?: PIXI.Options): Promise<PIXI.Sound> => {
  return new Promise((resolve, reject) => {
    const defaultOption = {
      url: url,
      preload: true,
    }
    const option = Object.assign(defaultOption, options)
    const loadOption = {
      loaded: (err: boolean, sound: PIXI.Sound): void => {
        err ? reject() : resolve(sound)
      },
    }
    PIXI.Sound.from(Object.assign(option, loadOption))
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
  soundStore.jump = await load(jump)
  soundStore.getAirTank = await load(getAirTank)
  soundStore.foot = await load(foot)
  soundStore.fire = await load(fire)
  soundStore.enemyHit = await load(enemyHit)
  soundStore.dandelionShot = await load(dandelionShot)
  soundStore.danball = await load(danball)
  soundStore.burner = await load(burner)
  soundStore.airTankBecameEmpty = await load(airTankBecameEmpty)
  soundStore.airJet = await load(airJet)
}
