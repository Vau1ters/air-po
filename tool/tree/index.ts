import { Canvas, Image, loadImage } from 'node-canvas'
import { assert } from '../../src/core/utils/assertion'
import { Bound } from '../util/bound'
import { getImageData, Pixel, outputCanvas } from '../util/image'
import { TileMapping } from '../../src/game/entities/tileEntityFactory'
import fs from 'fs'

type FindCornerResult = {
  leftTop: Array<Pixel>
  rightTop: Array<Pixel>
  leftBottom: Array<Pixel>
  rightBottom: Array<Pixel>
}

const findCorners = (image: ImageData): FindCornerResult => {
  const result: FindCornerResult = { leftTop: [], rightTop: [], leftBottom: [], rightBottom: [] }
  let c0: Pixel | undefined = new Pixel(0, 0, image)
  while (c0) {
    const check = (c1?: Pixel, c2?: Pixel): boolean => {
      if (!c0 || !c1 || !c2) return false
      const colors = [c0.rgba, c1.rgba, c2.rgba]
      return colors.every(c => c.r == 0x00 && c.g == 0x00 && c.b === 0xff)
    }
    if (check(c0.right(), c0.down())) result.leftTop.push(c0)
    if (check(c0.left(), c0.down())) result.rightTop.push(c0)
    if (check(c0.right(), c0.up())) result.leftBottom.push(c0)
    if (check(c0.left(), c0.up())) result.rightBottom.push(c0)
    c0 = c0.advance()
  }
  return result
}

const findBounds = (corners: FindCornerResult): Array<Bound> => {
  const bounds: Array<Bound> = []
  for (const start of corners.leftTop) {
    const rightTopCandidates = corners.rightTop.filter(c => c.y === start.y && start.x < c.x)
    if (rightTopCandidates.length === 0) continue
    const leftBottomCandidates = corners.leftBottom.filter(c => c.x === start.x && start.y < c.y)
    if (leftBottomCandidates.length === 0) continue
    const endX = Math.min(...rightTopCandidates.map(c => c.x))
    const endY = Math.min(...leftBottomCandidates.map(c => c.y))
    const end = corners.rightBottom.find(c => c.x === endX && c.y == endY)
    assert(end, `Could not find right bottom corner (${endX}, ${endY})`)
    const bound = Bound.fromCorner(start, end)
    if (bound.width <= 2) continue
    if (bound.height <= 2) continue
    assert(
      bound.width % 8 === 0,
      `width of bound must be multiple of 8: (x, y, w, h) = (${bound.x}, ${bound.y}, ${bound.width}, ${bound.height})`
    )
    assert(
      bound.height % 8 === 0,
      `height of bound must be multiple of 8: (x, y, w, h) = (${bound.x}, ${bound.y}, ${bound.width}, ${bound.height})`
    )
    bounds.push(bound)
  }
  return bounds
}

const calcBoundMap = (bounds: Array<Bound>): Array<[Bound, Bound]> => {
  // 高さ順にソートして左から順に詰めていく
  // 空き領域があったらそこに詰める
  // 横長の画像になっちゃうけど許して
  const boundMap = new Array<[Bound, Bound]>()
  bounds = bounds.sort((a: Bound, b: Bound): number => {
    if (a.height !== b.height) return b.height - a.height
    return b.area - a.area
  })
  const height = bounds[0].height
  const spaces = new Array<Bound>()
  let x = 0
  for (const bound of bounds) {
    const spaceIndex = spaces.findIndex(
      space => bound.width <= space.width && bound.height <= space.height
    )
    if (spaceIndex !== -1) {
      const [space] = spaces.splice(spaceIndex, 1)
      // 空き領域が見つかったのでそこに詰める
      boundMap.push([bound, new Bound(space.x, space.y, bound.width, bound.height)])

      // 空き領域を分割(分割のしかたについては諸説)
      if (bound.width < space.width) {
        spaces.push(
          new Bound(space.x + bound.width, space.y, space.width - bound.width, space.height)
        )
      }
      if (bound.height < space.height) {
        spaces.push(
          new Bound(
            space.x,
            space.y + bound.height,
            space.width - bound.width,
            space.height - bound.height
          )
        )
      }
    } else {
      // 空き領域が見つからなかったので普通に詰める
      boundMap.push([bound, new Bound(x, 0, bound.width, bound.height)])
      // 空き領域を作成
      const spaceHeight = height - bound.height
      if (spaceHeight > 0) {
        const lastSpace = spaces.pop()
        if (lastSpace && lastSpace.height == spaceHeight) {
          // 高さが同じなので前の空き領域と結合
          spaces.push(
            new Bound(lastSpace.x, lastSpace.y, lastSpace.width + bound.width, lastSpace.height)
          )
        } else {
          // 無理そうなので普通に作成
          if (lastSpace) spaces.push(lastSpace)
          spaces.push(new Bound(x, bound.height, bound.width, spaceHeight))
        }
      }
      x += bound.width
    }
  }

  return boundMap
}

const packImage = (image: Image, boundMap: Array<[Bound, Bound]>): Canvas => {
  const width = boundMap.map(([_, dst]) => dst.x + dst.width).reduce((a, b) => (a > b ? a : b))
  const height = boundMap.map(([_, dst]) => dst.y + dst.height).reduce((a, b) => (a > b ? a : b))
  const canvas = new Canvas(width, height)
  const ctx = canvas.getContext('2d')
  for (const [src, dst] of boundMap) {
    ctx.drawImage(image, src.x, src.y, src.width, src.height, dst.x, dst.y, dst.width, dst.height)
  }
  return canvas
}

const toMappingObject = (boundMap: Array<[Bound, Bound]>): Array<TileMapping> => {
  const srcWidth =
    boundMap.map(([src, _]) => src.x + src.width).reduce((a, b) => (a > b ? a : b)) / 8
  const dstWidth =
    boundMap.map(([_, dst]) => dst.x + dst.width).reduce((a, b) => (a > b ? a : b)) / 8
  const result = new Array<TileMapping>()
  for (const [src, dst] of boundMap) {
    for (let y = 0; y < dst.height / 8; y++) {
      for (let x = 0; x < dst.width / 8; x++) {
        result.push({
          src: (src.y / 8 + y) * srcWidth + (src.x / 8 + x),
          dst: (dst.y / 8 + y) * dstWidth + (dst.x / 8 + x),
        })
      }
    }
  }
  return result
}

export const packTreeImage = async (): Promise<void> => {
  const originalImage = await loadImage(__dirname + '/../../res/image/tree.png')
  const guideImage = await loadImage(__dirname + '/../../res/image/treeGuide.png')
  const buffer = getImageData(guideImage)
  const corners = findCorners(buffer)
  const bounds = findBounds(corners)
  const boundMap = calcBoundMap(bounds)
  await outputCanvas(
    __dirname + '/../../res/image/treeTile.autogen.png',
    packImage(originalImage, boundMap)
  )
  fs.writeFileSync(
    __dirname + '/../../res/tileMapping/tree.autogen.json',
    JSON.stringify(toMappingObject(boundMap), null, '  ')
  )
}
