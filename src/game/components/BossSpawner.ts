import Phaser from 'phaser';
import { BossDefinition } from '../bosses/BossDefinition';
import { getPlayfieldBounds } from '../layout/Playfield';
import { BossShip } from '../objects/BossShip';

export class BossSpawner {
  private readonly bosses: Phaser.Physics.Arcade.Group;

  constructor(private readonly scene: Phaser.Scene) {
    this.bosses = this.scene.physics.add.group({
      classType: BossShip,
      maxSize: 4,
      runChildUpdate: true
    });
  }

  getGroup(): Phaser.Physics.Arcade.Group {
    return this.bosses;
  }

  spawnBoss(definition: BossDefinition) {
    const bounds = getPlayfieldBounds(this.scene.scale.width, this.scene.scale.height);
    const x = Math.round((bounds.left + bounds.right) * 0.5);
    const y = -30;

    const boss = this.bosses.get(x, y) as BossShip | null;
    if (!boss) {
      return;
    }

    boss.spawn(definition, x, y);
  }

  hasActiveBoss(): boolean {
    return this.bosses.countActive(true) > 0;
  }

  getVisibleBossHealthRatio(): number | null {
    const visibleBoss = this.findVisibleBoss();
    if (!visibleBoss) {
      return null;
    }

    return visibleBoss.getHealthRatio();
  }

  private findVisibleBoss(): BossShip | null {
    const screenHeight = this.scene.scale.height;
    let match: BossShip | null = null;

    this.bosses.children.each((child) => {
      const boss = child as BossShip;
      if (!boss.active || !boss.visible) {
        return true;
      }

      const top = boss.y - boss.displayHeight * 0.5;
      const bottom = boss.y + boss.displayHeight * 0.5;
      if (bottom <= 0 || top >= screenHeight) {
        return true;
      }

      match = boss;
      return false;
    });

    return match;
  }
}
