import Phaser from 'phaser';
import { SpiralProjectileConfig, WeaponProjectileConfig } from '../ships/ShipDefinition';

type SpiralState = {
  centerX: number;
  centerY: number;
  centerVelocityX: number;
  centerVelocityY: number;
  angularSpeed: number;
  phase: number;
  radius: number;
  radiusGrowth: number;
};

export class PlayerBullet extends Phaser.Physics.Arcade.Image {
  private spiralState: SpiralState | null = null;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'bullet-laser');

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setActive(false);
    this.setVisible(false);
  }

  fire(x: number, y: number, projectile: WeaponProjectileConfig) {
    this.enableBody(true, x, y, true, true);
    this.setTexture(projectile.textureKey);

    const bulletScale = projectile.scale ?? 1;
    this.setScale(bulletScale);

    if (projectile.motion === 'spiral') {
      this.activateSpiralMotion(x, y, projectile);
    } else {
      this.spiralState = null;
      this.setVelocity(projectile.velocityX, projectile.velocityY);
    }

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setSize(this.displayWidth, this.displayHeight, true);
  }

  preUpdate(_time: number, delta: number): void {
    if (this.spiralState) {
      const dt = delta / 1000;
      this.updateSpiralPosition(dt);
      const body = this.body as Phaser.Physics.Arcade.Body;
      body.updateFromGameObject();
    }

    const width = this.scene.scale.width;
    const height = this.scene.scale.height;

    if (this.active && (this.y < -40 || this.y > height + 40 || this.x < -40 || this.x > width + 40)) {
      this.disableBody(true, true);
      this.spiralState = null;
    }
  }

  private activateSpiralMotion(x: number, y: number, projectile: SpiralProjectileConfig) {
    this.setVelocity(0, 0);
    this.spiralState = {
      centerX: x,
      centerY: y,
      centerVelocityX: projectile.centerVelocityX,
      centerVelocityY: projectile.centerVelocityY,
      angularSpeed: projectile.angularSpeed,
      phase: projectile.phase,
      radius: projectile.initialRadius,
      radiusGrowth: projectile.radiusGrowth
    };

    this.x = x + Math.cos(projectile.phase) * projectile.initialRadius;
    this.y = y + Math.sin(projectile.phase) * projectile.initialRadius;
  }

  private updateSpiralPosition(deltaSeconds: number) {
    if (!this.spiralState) {
      return;
    }

    this.spiralState.centerX += this.spiralState.centerVelocityX * deltaSeconds;
    this.spiralState.centerY += this.spiralState.centerVelocityY * deltaSeconds;
    this.spiralState.phase += this.spiralState.angularSpeed * deltaSeconds;
    this.spiralState.radius += this.spiralState.radiusGrowth * deltaSeconds;

    this.x = this.spiralState.centerX + Math.cos(this.spiralState.phase) * this.spiralState.radius;
    this.y = this.spiralState.centerY + Math.sin(this.spiralState.phase) * this.spiralState.radius;
  }
}
