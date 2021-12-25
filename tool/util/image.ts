import { Canvas, Image } from 'node-canvas'
import { assert } from '../../src/core/utils/assertion'
import fs from 'fs'

export type Rgba = {
  r: number
  g: number
  b: number
  a: number
}

export class Pixel {
  constructor(
    public readonly x: number,
    public readonly y: number,
    private readonly image: ImageData
  ) {}

  public get isValid(): boolean {
    if (this.x < 0) return false
    if (this.y < 0) return false
    if (this.x >= this.image.width) return false
    if (this.y >= this.image.height) return false
    return true
  }

  public ensure(): Pixel | undefined {
    return this.isValid ? this : undefined
  }

  public left(): Pixel | undefined {
    return new Pixel(this.x - 1, this.y, this.image).ensure()
  }

  public right(): Pixel | undefined {
    return new Pixel(this.x + 1, this.y, this.image).ensure()
  }

  public up(): Pixel | undefined {
    return new Pixel(this.x, this.y - 1, this.image).ensure()
  }

  public down(): Pixel | undefined {
    return new Pixel(this.x, this.y + 1, this.image).ensure()
  }

  public advance(): Pixel | undefined {
    return this.right() ?? new Pixel(0, this.y + 1, this.image).ensure()
  }

  public get rgba(): Rgba {
    assert(this.isValid, '')
    const index = (this.x + this.y * this.image.width) * 4
    const r = this.image.data[index + 0]
    const g = this.image.data[index + 1]
    const b = this.image.data[index + 2]
    const a = this.image.data[index + 3]
    return { r, g, b, a }
  }
}

export const getImageData = (image: Image): ImageData => {
  const canvas = new Canvas(image.width, image.height)
  const ctx = canvas.getContext('2d')
  ctx.drawImage(image, 0, 0)
  return ctx.getImageData(0, 0, image.width, image.height)
}

export const outputCanvas = (path: string, canvas: Canvas): Promise<void> =>
  new Promise(resolve => {
    const out = fs.createWriteStream(path)
    const stream = canvas.createPNGStream()
    stream.pipe(out)
    out.on('finish', resolve)
  })
