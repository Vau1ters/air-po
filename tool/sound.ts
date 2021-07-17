import * as fs from 'fs'
import * as path from 'path'

export const buildSound = (): void => {
  const outputPath = 'src/core/sound/soundURL.ts'
  const soundDir = 'res/sound'

  const importList: string[] = []
  const nameList: string[] = []

  fs.readdirSync(soundDir, { withFileTypes: true }).forEach(e => {
    const filename = e.name
    const name = path.parse(filename).name
    importList.push(`import ${name} from '@${soundDir}/${filename}'`)

    nameList.push(name)
  })

  const headerText = fs.readFileSync('tool/template/header.ts', 'ascii')
  const generatedText = fs
    .readFileSync('tool/template/soundURL.ts', 'ascii')
    .replace('// HEADER', headerText)
    .replace('// IMPORT', importList.join('\n'))
    .replace('// OBJECT', nameList.join(','))
  fs.writeFile(outputPath, generatedText, () => {})
}
