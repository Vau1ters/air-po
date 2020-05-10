export class InvincibleComponent {
  // 一律1秒無敵
  public static INVINCIBLE_TIME = 1

  public invincibleTime = 0

  public isInvincible(): boolean {
    return this.invincibleTime > 0
  }
}
