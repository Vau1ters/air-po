export class BulletComponent {
  private static readonly INITIAL_LIFE = 20
  public life: number

  constructor(life: number = BulletComponent.INITIAL_LIFE) {
    this.life = life
  }
}
