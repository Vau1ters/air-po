import * as fs from 'fs'

const fileText = `
/*+.† NOTIFICATION †.+*/
// this file is automatically written by soundtool.
// you can update this file by type "yarn soundtool" command.

// IMPORT

import * as PIXI_SOUND from '@pixi/sound'

type PlayOptions = PIXI_SOUND.PlayOptions & {
  pan?: number
}
type StereoFilter = InstanceType<typeof PIXI_SOUND.filters.StereoFilter>

export const soundStore: { [key: string]: PIXI_SOUND.Sound } = {}
export const play = (name: string, option?: PlayOptions): void => {
  option = option ? option : {}
  const sound = soundStore[name]
  if (option.pan) {
    const [stereoFilter] = sound.filters as StereoFilter[]
    stereoFilter.pan = option.pan
  }
  if (sound !== undefined) sound.play(option)
  else console.log(name, ':is not found')
}

const load = (url: string): Promise<PIXI_SOUND.Sound> => {
  return new Promise((resolve, reject) => {
    PIXI_SOUND.Sound.from({
      url: url,
      preload: true,
      loaded: (err, sound) => {
        if (err || !sound) {
          reject()
        } else {
          sound.filters = [new PIXI_SOUND.filters.StereoFilter()]
          resolve(sound)
        }
      },
    })
  })
}

export const init = async (): Promise<void> => {
  // LOAD_RESOURCE
}
`
const importText = (filename: string): string => {
  return `import ${filename} from '@res/sound/${filename}.ogg'`
}
const loadFormatText = (filename: string): string => {
  return `soundStore.${filename} = await load(${filename})`
}

const soundPath = 'res/sound'
const soundTsPath = 'src/core/sound/sound.ts'
const dir = fs.readdirSync(soundPath, { withFileTypes: true })

const importReg = new RegExp('// IMPORT')
const loadReg = new RegExp('// LOAD_RESOURCE')

console.log('File added:')
const generatedText = dir.reduce((text, file) => {
  const filename = file.name.split('.')[0]
  text = text.replace(importReg, `// IMPORT\n${importText(filename)}`)
  text = text.replace(loadReg, `// LOAD_RESOURCE\n  ${loadFormatText(filename)}`)
  console.log(file.name)
  return text
}, fileText)

fs.writeFile(soundTsPath, generatedText, err => {
  if (err) throw err
  console.log('Successfully generated soundtool.ts')
})
