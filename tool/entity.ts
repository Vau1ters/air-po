import * as fs from 'fs'
import * as path from 'path'

export const buildEntity = (): void => {
  const outputPath = 'src/game/entities/loader/entitySetting.ts'
  const entityDir = 'res/entity'

  const importList: string[] = []
  const nameList: string[] = []

  fs.readdirSync(entityDir, { withFileTypes: true }).forEach(e => {
    const filename = e.name
    const name = path.parse(filename).name
    importList.push(`import ${name} from '@${entityDir}/${filename}'`)
    nameList.push(name)
  })

  const headerText = fs.readFileSync('tool/template/header.ts', 'ascii')
  const generatedText = fs
    .readFileSync('tool/template/entitySetting.ts', 'ascii')
    .replace('// HEADER', headerText)
    .replace('// IMPORT', importList.join('\n'))
    .replace('// OBJECT', nameList.join(','))
  fs.writeFile(outputPath, generatedText, () => {})
}
