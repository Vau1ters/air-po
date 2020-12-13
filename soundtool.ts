import * as fs from 'fs'

const fileText = `
// IMPORT
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
let generatedText = fileText
dir.forEach(e => {
  const filename = e.name.split('.')[0]
  const importReg = new RegExp('// IMPORT')
  const loadReg = new RegExp('// LOAD_RESOURCE')
  generatedText = generatedText.replace(importReg, `// IMPORT\n${importText(filename)}`)
  generatedText = generatedText.replace(loadReg, `// LOAD_RESOURCE\n  ${loadFormatText(filename)}`)
})
fs.writeFile(soundTsPath, generatedText, () => {})
