import * as fs from 'fs'
import * as path from 'path'

export const buildTile = (): void => {
  const outputPath = 'src/game/stage/tileList.ts'
  const tileDir = 'src/game/entities/stage/tile'

  const importList: string[] = []
  const nameList: string[] = []

  fs.readdirSync(tileDir, { withFileTypes: true }).forEach(e => {
    const filename = e.name
    const pattern = /^(.*)Factory.ts$/
    const matchResult = filename.match(pattern)
    if (matchResult === null) {
      console.error(matchResult !== null, `invalid file name: ${filename}`)
      return
    }
    const name = matchResult[1]
    importList.push(`import ${name} from '${tileDir}/${path.parse(filename).name}'`)
    nameList.push(`${name},`)
  })

  const headerText = fs.readFileSync('tool/template/header.ts', 'ascii')
  const generatedText = fs
    .readFileSync('tool/template/tileList.ts', 'ascii')
    .replace('// HEADER', headerText)
    .replace('// IMPORT', importList.join('\n'))
    .replace('// OBJECT', nameList.join('\n'))
  fs.writeFile(outputPath, generatedText, () => {})
}
