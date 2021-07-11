import * as fs from 'fs'

const fileText = `
/*+.† NOTIFICATION †.+*/
// this file is automatically written by soundtool.
// you can update this file by type "yarn soundtool" command.

// IMPORT

export const soundURL = {
// OBJECT
}

`
const importText = (filename: string): string => {
  return `import ${filename} from '@res/sound/${filename}.ogg'`
}
const objectText = (filename: string): string => {
  return `${filename},`
}

const soundPath = 'res/sound'
const soundTsPath = 'src/core/sound/soundURL.ts'
const dir = fs.readdirSync(soundPath, { withFileTypes: true })

const importReg = new RegExp('// IMPORT')
const objectReg = new RegExp('// OBJECT')

console.log('File added:')
const generatedText = dir.reduce((text, file) => {
  const filename = file.name.split('.')[0]
  text = text.replace(importReg, `// IMPORT\n${importText(filename)}`)
  text = text.replace(objectReg, `// OBJECT\n${objectText(filename)}`)
  console.log(file.name)
  return text
}, fileText)

fs.writeFile(soundTsPath, generatedText, err => {
  if (err) throw err
  console.log('Successfully generated soundtool.ts')
})
