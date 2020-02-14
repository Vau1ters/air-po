export interface PoComponent {
  a: number
}

export interface MeuComponent {
  b: string
}

export interface ComponentFactory {
  Po: PoComponent
  Meu: MeuComponent
}

export type ComponentName = keyof ComponentFactory
