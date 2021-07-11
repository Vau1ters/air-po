import * as fs from 'fs'

const fileText = `
/*+.† NOTIFICATION †.+*/
// this file is automatically written by soundtool.
// you can update this file by type "yarn soundtool" command.

// IMPORT

export const AllSoundName = [
  // NAME
] as const
export type SoundName = typeof AllSoundName[number]

export const getSoundURL = (name: SoundName): string => {
  switch (name) {
// CASE
  }
}

`
const importText = (filename: string): string => {
  return `import ${filename} from '@res/sound/${filename}.ogg'`
}
const nameText = (filename: string): string => {
  return `'${filename}',`
}
const caseText = (filename: string): string => {
  return `case '${filename}': return ${filename}`
}

const soundPath = 'res/sound'
const soundTsPath = 'src/core/sound/soundStore.ts'
const dir = fs.readdirSync(soundPath, { withFileTypes: true })

const importReg = new RegExp('// IMPORT')
const nameReg = new RegExp('// NAME')
const caseReg = new RegExp('// CASE')

console.log('File added:')
const generatedText = dir.reduce((text, file) => {
  const filename = file.name.split('.')[0]
  text = text.replace(importReg, `// IMPORT\n${importText(filename)}`)
  text = text.replace(nameReg, `// NAME\n${nameText(filename)}`)
  text = text.replace(caseReg, `// CASE\n${caseText(filename)}`)
  console.log(file.name)
  return text
}, fileText)

fs.writeFile(soundTsPath, generatedText, err => {
  if (err) throw err
  console.log('Successfully generated soundtool.ts')
})
