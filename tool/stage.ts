import * as fs from 'fs'
import * as path from 'path'

export const buildStage = (): void => {
  const outputPath = 'src/game/stage/stageList.ts'
  const stageDir = 'res/stage'

  const importList: string[] = []
  const nameList: string[] = []

  fs.readdirSync(stageDir, { withFileTypes: true })
    .filter(e => e.isFile())
    .forEach(e => {
      const filename = e.name
      const name = path.parse(filename).name
      importList.push(`import ${name} from '@${stageDir}/${filename}'`)
      nameList.push(`${name},`)
    })

  const headerText = fs.readFileSync('tool/template/header.ts', 'ascii')
  const generatedText = fs
    .readFileSync('tool/template/stageList.ts', 'ascii')
    .replace('// HEADER', headerText)
    .replace('// IMPORT', importList.join('\n'))
    .replace('// OBJECT', nameList.join('\n'))
  fs.writeFile(outputPath, generatedText, () => {})
}
