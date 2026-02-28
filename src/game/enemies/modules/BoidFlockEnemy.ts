import Phaser from 'phaser';
import { EnemyDefinition } from '../EnemyDefinition';
import { EnemyShip } from '../../objects/EnemyShip';
import { PlayerBullet } from '../../objects/PlayerBullet';
import { CGA_NUM } from '../../style/CgaPalette';

type BoidState = {
  velocity: Phaser.Math.Vector2;
  cruiseY: number;
};

const NEIGHBOR_RADIUS = 64;
const SEPARATION_RADIUS = 22;
const BULLET_AVOID_RADIUS = 74;

// Handles velocity integration for flock behavior and bullet dodges.
function updateBoidVelocity(
  enemy: Phaser.Physics.Arcade.Sprite,
  boid: BoidState,
  deltaSeconds: number,
  playfieldLeft: number,
  playfieldRight: number,
  sceneHeight: number,
  peers: EnemyShip[],
  bullets: PlayerBullet[]
) {
  const cohesionCenter = new Phaser.Math.Vector2(0, 0);
  const alignmentVelocity = new Phaser.Math.Vector2(0, 0);
  const separationForce = new Phaser.Math.Vector2(0, 0);
  let neighborCount = 0;

  for (const peer of peers) {
    if (peer === enemy || !peer.active) {
      continue;
    }

    const dx = peer.x - enemy.x;
    const dy = peer.y - enemy.y;
    const distance = Math.hypot(dx, dy);

    if (distance > NEIGHBOR_RADIUS || distance === 0) {
      continue;
    }

    neighborCount += 1;
    cohesionCenter.x += peer.x;
    cohesionCenter.y += peer.y;

    const peerBody = peer.body as Phaser.Physics.Arcade.Body;
    alignmentVelocity.x += peerBody.velocity.x;
    alignmentVelocity.y += peerBody.velocity.y;

    if (distance < SEPARATION_RADIUS) {
      const strength = (SEPARATION_RADIUS - distance) / SEPARATION_RADIUS;
      separationForce.x -= (dx / distance) * strength;
      separationForce.y -= (dy / distance) * strength;
    }
  }

  const acceleration = new Phaser.Math.Vector2(0, 0);

  if (neighborCount > 0) {
    cohesionCenter.scale(1 / neighborCount);
    alignmentVelocity.scale(1 / neighborCount);

    acceleration.x += (cohesionCenter.x - enemy.x) * 0.9;
    acceleration.y += (cohesionCenter.y - enemy.y) * 0.85;
    acceleration.x += (alignmentVelocity.x - boid.velocity.x) * 0.28;
    acceleration.y += (alignmentVelocity.y - boid.velocity.y) * 0.28;
    acceleration.x += separationForce.x * 130;
    acceleration.y += separationForce.y * 130;
  }

  // Slight downward bias keeps the flock from drifting off-screen upward.
  acceleration.y += (boid.cruiseY - enemy.y) * 1.1;

  // Avoid nearby bullets with a short, sharp side-step impulse.
  for (const bullet of bullets) {
    if (!bullet.active) {
      continue;
    }

    const dx = enemy.x - bullet.x;
    const dy = enemy.y - bullet.y;
    const distance = Math.hypot(dx, dy);

    if (distance === 0 || distance > BULLET_AVOID_RADIUS) {
      continue;
    }

    const strength = (BULLET_AVOID_RADIUS - distance) / BULLET_AVOID_RADIUS;
    acceleration.x += (dx / distance) * strength * 220;
    acceleration.y += (dy / distance) * strength * 140;
  }

  const edgePadding = 20;
  if (enemy.x < playfieldLeft + edgePadding) {
    acceleration.x += (playfieldLeft + edgePadding - enemy.x) * 7;
  } else if (enemy.x > playfieldRight - edgePadding) {
    acceleration.x -= (enemy.x - (playfieldRight - edgePadding)) * 7;
  }

  const topPadding = 16;
  const bottomLimit = sceneHeight * 0.76;
  if (enemy.y < topPadding) {
    acceleration.y += (topPadding - enemy.y) * 9;
  } else if (enemy.y > bottomLimit) {
    acceleration.y -= (enemy.y - bottomLimit) * 7;
  }

  boid.velocity.x += acceleration.x * deltaSeconds;
  boid.velocity.y += acceleration.y * deltaSeconds;

  const speed = boid.velocity.length();
  const clampedSpeed = Phaser.Math.Clamp(speed, 28, 88);
  if (speed > 0.001) {
    boid.velocity.scale(clampedSpeed / speed);
  }

  enemy.x += boid.velocity.x * deltaSeconds;
  enemy.y += boid.velocity.y * deltaSeconds;
  enemy.setAngle(Phaser.Math.Clamp(boid.velocity.x * 0.12, -22, 22));
}

export const enemyModule: EnemyDefinition = {
  id: 'boid-flock',
  name: 'BOI',
  textureKey: 'enemy-boid-flock',
  spawnWeight: 0.2,
  spawn: {
    minDelay: 0.22,
    maxDelay: 0.42,
    minSpeed: 68,
    maxSpeed: 96,
    xPadding: 16
  },
  collider: {
    width: 11,
    height: 10,
    offsetX: 2,
    offsetY: 2
  },
  movement: {
    onSpawn: ({ initialSpeed, scene }) => {
      return {
        velocity: new Phaser.Math.Vector2(
          Phaser.Math.FloatBetween(-26, 26),
          Phaser.Math.FloatBetween(initialSpeed * 0.75, initialSpeed * 1.1)
        ),
        cruiseY: Phaser.Math.FloatBetween(scene.scale.height * 0.2, scene.scale.height * 0.56)
      } satisfies BoidState;
    },
    onUpdate: ({ enemy, state, deltaSeconds, playfieldLeft, playfieldRight, scene }) => {
      const boid = state as BoidState;
      const peers = scene.children.list.filter(
        (child): child is EnemyShip => child instanceof EnemyShip && child.texture.key === 'enemy-boid-flock'
      );
      const bullets = scene.children.list.filter(
        (child): child is PlayerBullet => child instanceof PlayerBullet && child.active
      );

      updateBoidVelocity(
        enemy,
        boid,
        deltaSeconds,
        playfieldLeft,
        playfieldRight,
        scene.scale.height,
        peers,
        bullets
      );
    }
  },
  registerAssets: (scene: Phaser.Scene) => {
    const g = scene.add.graphics();

    g.fillStyle(CGA_NUM.white, 1);
    g.fillRect(1, 8, 14, 2);
    g.fillStyle(CGA_NUM.cyan, 1);
    g.fillRect(3, 5, 10, 4);
    g.fillStyle(CGA_NUM.magenta, 1);
    g.fillRect(6, 2, 4, 3);
    g.fillStyle(CGA_NUM.black, 1);
    g.fillRect(7, 6, 2, 1);
    g.generateTexture('enemy-boid-flock', 16, 16);

    g.destroy();
  }
};
