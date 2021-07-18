import * as fs from 'fs'
import * as path from 'path'
import { buildMetaSource } from './build'

export const buildTile = (): void => {
  const importList: string[] = []
  const nameList: string[] = []

  buildMetaSource({
    outputPath: 'src/game/stage/tileList.ts',
    watchDir: 'src/game/entities/stage/tile',
    templatePath: 'tool/template/tileList.ts',
    onInput: (watchDir: string, e: fs.Dirent) => {
      const filename = e.name
      const pattern = /^(.*)Factory.ts$/
      const matchResult = filename.match(pattern)
      if (matchResult === null) {
        console.error(matchResult !== null, `invalid file name: ${filename}`)
        return
      }
      const name = matchResult[1]
      importList.push(`import ${name} from '${watchDir}/${path.parse(filename).name}'`)
      nameList.push(`${name},`)
    },
    replacementMap: () => {
      return {
        IMPORT: importList.join('\n'),
        OBJECT: nameList.join('\n')
      }
    }
  })
}
