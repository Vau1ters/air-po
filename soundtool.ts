import * as fs from 'fs'

const fileText = `
/*+.† NOTIFICATION †.+*/
// this file is automatically written by soundtool.
// you can update this file by type "yarn soundtool" command.

// #†IMPORT†#

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
  // #†LOAD_RESOURCE†#
}
`
function importText(filename: string): string {
  return `import ${filename} from '@res/sound/${filename}.wav'`
}
function loadFormatText(filename: string): string {
  return `soundStore.${filename} = await load(${filename})`
}

const soundPath = 'res/sound'
const soundTsPath = 'src/core/sound/sound.ts'
const dir = fs.readdirSync(soundPath, { withFileTypes: true })
let generatedText = dir.reduce((text, file) => {
  const filename = file.name.split('.')[0]
  const importReg = new RegExp('// #†IMPORT†#')
  const loadReg = new RegExp('// #†LOAD_RESOURCE†#')
  text = text.replace(importReg, `// #†IMPORT†#\n${importText(filename)}`)
  text = text.replace(loadReg, `// #†LOAD_RESOURCE†#\n  ${loadFormatText(filename)}`)
  return text;
}, fileText)

fs.writeFile(soundTsPath, generatedText, (err) => {
  if (err) throw err;
  console.log("Successfully generated soundtool.ts")
})
