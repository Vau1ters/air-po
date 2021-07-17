import * as fs from 'fs'
import * as path from 'path'

export const buildObject = (): void => {
  const outputPath = 'src/game/stage/objectList.ts'
  const objectDir = 'src/game/entities/stage/object'

  const importList: string[] = []
  const nameList: string[] = []

  fs.readdirSync(objectDir, { withFileTypes: true }).forEach(e => {
    const filename = e.name
    const pattern = /^(.*)Factory.ts$/
    const matchResult = filename.match(pattern)
    if (matchResult === null) {
      console.error(matchResult !== null, `invalid file name: ${filename}`)
      return
    }
    const name = matchResult[1]
    importList.push(`import ${name} from '${objectDir}/${path.parse(filename).name}'`)
    nameList.push(`${name},`)
  })

  const headerText = fs.readFileSync('tool/template/header.ts', 'ascii')
  const generatedText = fs
    .readFileSync('tool/template/objectList.ts', 'ascii')
    .replace('// HEADER', headerText)
    .replace('// IMPORT', importList.join('\n'))
    .replace('// OBJECT', nameList.join('\n'))
  fs.writeFile(outputPath, generatedText, () => {})
}
