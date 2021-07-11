/*+.† NOTIFICATION †.+*/
// this file is automatically written by soundtool.
// you can update this file by type "yarn soundtool" command.

// IMPORT
import start from '@res/sound/start.ogg'
import snibeeDie from '@res/sound/snibeeDie.ogg'
import snibee from '@res/sound/snibee.ogg'
import slime4 from '@res/sound/slime4.ogg'
import slime3 from '@res/sound/slime3.ogg'
import slime2 from '@res/sound/slime2.ogg'
import slime1 from '@res/sound/slime1.ogg'
import shot from '@res/sound/shot.ogg'
import pon from '@res/sound/pon.ogg'
import playerWalk from '@res/sound/playerWalk.ogg'
import playerLanding from '@res/sound/playerLanding.ogg'
import playerJump from '@res/sound/playerJump.ogg'
import playerHit from '@res/sound/playerHit.ogg'
import peti from '@res/sound/peti.ogg'
import mushroom from '@res/sound/mushroom.ogg'
import grab from '@res/sound/grab.ogg'
import getAirTank from '@res/sound/getAirTank.ogg'
import foot from '@res/sound/foot.ogg'
import fire from '@res/sound/fire.ogg'
import enemyHit from '@res/sound/enemyHit.ogg'
import dandelionShot from '@res/sound/dandelionShot.ogg'
import danball from '@res/sound/danball.ogg'
import burner from '@res/sound/burner.ogg'
import airJet from '@res/sound/airJet.ogg'

export const AllSoundName = [
  // NAME
  'start',
  'snibeeDie',
  'snibee',
  'slime4',
  'slime3',
  'slime2',
  'slime1',
  'shot',
  'pon',
  'playerWalk',
  'playerLanding',
  'playerJump',
  'playerHit',
  'peti',
  'mushroom',
  'grab',
  'getAirTank',
  'foot',
  'fire',
  'enemyHit',
  'dandelionShot',
  'danball',
  'burner',
  'airJet',
] as const
export type SoundName = typeof AllSoundName[number]

export const getSoundURL = (name: SoundName): string => {
  switch (name) {
    // CASE
    case 'start':
      return start
    case 'snibeeDie':
      return snibeeDie
    case 'snibee':
      return snibee
    case 'slime4':
      return slime4
    case 'slime3':
      return slime3
    case 'slime2':
      return slime2
    case 'slime1':
      return slime1
    case 'shot':
      return shot
    case 'pon':
      return pon
    case 'playerWalk':
      return playerWalk
    case 'playerLanding':
      return playerLanding
    case 'playerJump':
      return playerJump
    case 'playerHit':
      return playerHit
    case 'peti':
      return peti
    case 'mushroom':
      return mushroom
    case 'grab':
      return grab
    case 'getAirTank':
      return getAirTank
    case 'foot':
      return foot
    case 'fire':
      return fire
    case 'enemyHit':
      return enemyHit
    case 'dandelionShot':
      return dandelionShot
    case 'danball':
      return danball
    case 'burner':
      return burner
    case 'airJet':
      return airJet
  }
}
