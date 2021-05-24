import * as fs from 'fs'

const outputPath = 'src/core/graphics/art.ts'
const artPath = 'res/image'
const settingPath = 'res/setting'

const importList: string[] = []
const loadList: string[] = []

fs.readdirSync(settingPath, { withFileTypes: true }).forEach(e => {
  const stgPath = e.name
  const { name, path: imgPath } = require(`./${settingPath}/${stgPath}`) // eslint-disable-line  @typescript-eslint/no-var-requires

  importList.push(`import ${name}Setting from '@${settingPath}/${stgPath}'`)
  importList.push(`import ${name}Img from '@${artPath}/${imgPath}'`)

  loadList.push(`textureStore.${name} = await buildTextureCache(${name}Img, ${name}Setting)`)
})

const generatedText = `
// IMPORT
${importList.join('\n')}

/*+.† NOTIFICATION †.+*/
// this file is automatically written by arttool.
// you can update this file by type "yarn arttool" command.

import { BaseTexture, Rectangle, Texture } from 'pixi.js'

type Setting = {
  name: string
  path: string
  texture?: {
    size?: {
      width: number
      height: number
    }
  }
}

function loadTexture(url: string): Promise<BaseTexture> {
  return new Promise((resolve, reject) => {
    const texture = BaseTexture.from(url)
    if (texture.width > 0) resolve(texture)
    texture.on('loaded', (tex: BaseTexture) => {
      resolve(tex)
    })
    texture.on('error', (_tex: BaseTexture, event: ErrorEvent) => {
      reject(event)
    })
  })
}

async function buildTextureCache(baseURL: string, setting: Setting): Promise<Array<Texture>> {
  const base = await loadTexture(baseURL)
  const result = new Array<Texture>()
  const w = setting.texture?.size?.width ?? base.width
  const h = setting.texture?.size?.height ?? base.height
  for (let y = 0; y < base.height / h; y++) {
    for (let x = 0; x < base.width / w; x++) {
      const texture = new Texture(base, new Rectangle(x * w, y * h, w, h))
      result.push(texture)
    }
  }
  return result
}

export const textureStore: { [key: string]: Array<Texture> } = {}
export const init = async (): Promise<void> => {
// LOAD_RESOURCE
${loadList.join('\n')}
}
`
fs.writeFile(outputPath, generatedText, () => {})

// const importText = (filename: string, ext: string): string => {
//   const camelFilename = snakeToCamel(filename)
//   return ext === 'png'
//     ? `import ${camelFilename}Img from '@${artPath}/${filename}.${ext}'`
//     : `import ${camelFilename}Setting from '@${settingPath}/${filename}.${ext}'`
// }
// const loadImgText = (filename: string): string => {
//   return `textureStore.${filename} = await buildSingleTexture(${filename}Img)`
// }
// const imgDir = fs.readdirSync(artPath, { withFileTypes: true })
// const settingDir = fs.readdirSync(settingPath, { withFileTypes: true })

// imgDir.forEach(e => {
//   const [filename, ext] = e.name.split('.')
//   const camelFilename = snakeToCamel(filename)
//   generatedText = generatedText.replace(importReg, `// IMPORT\n${importText(filename, ext)}`)
//   generatedText = generatedText.replace(
//     loadReg,
//     `// LOAD_RESOURCE\n  ${loadImgText(camelFilename)}`
//   )
// })
// settingDir.forEach(e => {
//   const [filename, ext] = e.name.split('.')
//   const camelFilename = snakeToCamel(filename)
//   const singleTextureLoadReg = new RegExp('buildSingleTexture\\(' + `${camelFilename}Img\\)`)
//   generatedText = generatedText.replace(importReg, `// IMPORT\n${importText(filename, ext)}`)
//   generatedText = generatedText.replace(
//     singleTextureLoadReg,
//     `buildAnimationTexture(${camelFilename}Img, ${camelFilename}Setting)`
//   )
// })

// fs.writeFile(outputPath, generatedText, () => {})
