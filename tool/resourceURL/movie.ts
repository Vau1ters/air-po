import * as fs from 'fs'
import * as path from 'path'
import { buildMetaSource } from './build'

export const buildMovie = (): string => {
  const importList: string[] = []
  const nameList: string[] = []

  return buildMetaSource({
    outputPath: 'src/game/movie/movieList.ts',
    watchDir: 'res/movie',
    templatePath: 'movieList.ts',
    onInput: (watchDir: string, e: fs.Dirent) => {
      if (e.isFile() === false) return
      const filename = e.name
      const name = path.parse(filename).name
      importList.push(`import ${name} from '@${watchDir}/${filename}'`)
      nameList.push(`${name},`)
    },
    replacementMap: () => {
      return {
        IMPORT: importList.join('\n'),
        OBJECT: nameList.join('\n'),
      }
    },
  })
}
