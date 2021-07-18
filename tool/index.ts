import { buildEntity } from './entity'
import { buildStage } from './stage'
import { buildSound } from './sound'
import { buildSprite } from './sprite'
import { buildTile } from './tile'
import { buildObject } from './object'
import { buildComponent } from './component'
import * as cp from 'child_process'

const outputFiles: Array<string> = [
  buildSprite(),
  buildSound(),
  buildEntity(),
  buildStage(),
  buildTile(),
  buildObject(),
  buildComponent(),
]

cp.execSync(`./node_modules/.bin/eslint --fix ${outputFiles.join(' ')}`)
