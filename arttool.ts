import * as fs from 'fs'

const outputPath = 'src/core/graphics/art.ts'
const artDir = 'res/image'
const settingDir = 'res/setting'

const importList: string[] = []
const loadList: string[] = []

fs.readdirSync(settingDir, { withFileTypes: true }).forEach(e => {
  const settingFile = e.name
  const { name, path: imageFile } = require(`./${settingDir}/${settingFile}`) // eslint-disable-line  @typescript-eslint/no-var-requires

  importList.push(`import ${name}Setting from '@${settingDir}/${settingFile}'`)
  importList.push(`import ${name}Img from '@${artDir}/${imageFile}'`)

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
