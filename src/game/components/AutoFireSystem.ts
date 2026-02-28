import Phaser from 'phaser';
import { PlayerBullet } from '../objects/PlayerBullet';
import { PlayerShip } from '../objects/PlayerShip';
import { ShipDefinition } from '../ships/ShipDefinition';

export class AutoFireSystem {
  private readonly bullets: Phaser.Physics.Arcade.Group;
  private fireCooldown = 0;
  private activeShip: ShipDefinition;
  private baseWeaponLevel = 1;
  private weaponLevelMultiplier = 1;

  constructor(
    private readonly scene: Phaser.Scene,
    private readonly player: PlayerShip,
    initialShip: ShipDefinition
  ) {
    this.activeShip = initialShip;

    this.bullets = this.scene.physics.add.group({
      classType: PlayerBullet,
      maxSize: 64,
      runChildUpdate: true
    });
  }

  update(deltaSeconds: number) {
    this.fireCooldown -= deltaSeconds;
    if (this.fireCooldown <= 0) {
      this.fireCooldown = this.activeShip.weapon.fireInterval(this.getEffectiveWeaponLevel());
      this.fire();
    }
  }

  setShip(ship: ShipDefinition, weaponLevel: number) {
    this.activeShip = ship;
    this.baseWeaponLevel = Phaser.Math.Clamp(weaponLevel, 1, this.activeShip.weapon.maxLevel);
    this.fireCooldown = 0;
  }

  setWeaponLevelMultiplier(multiplier: number) {
    this.weaponLevelMultiplier = Math.max(1, multiplier);
  }

  getGroup(): Phaser.Physics.Arcade.Group {
    return this.bullets;
  }

  private fire() {
    const weaponLevel = this.getEffectiveWeaponLevel();

    for (const projectile of this.activeShip.weapon.projectiles) {
      const startX = this.player.x + projectile.offsetX;
      const startY = this.player.y + projectile.offsetY;

      const bullet = this.bullets.get(startX, startY) as PlayerBullet | null;
      if (!bullet) {
        continue;
      }

      bullet.fire(startX, startY, projectile, weaponLevel);
    }
  }

  private getEffectiveWeaponLevel() {
    return Math.max(1, this.baseWeaponLevel * this.weaponLevelMultiplier);
  }
}
