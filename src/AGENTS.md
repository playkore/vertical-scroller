# Source Architecture Guide

This file documents the architecture of the `src/` codebase and should be kept in sync with the real project structure.

## Maintenance Directive

- Update this file every time the source code architecture changes.
- Architecture changes include adding/removing/moving top-level modules, introducing new gameplay subsystems, changing scene/component boundaries, or reorganizing feature folders.

## Top-Level Structure

- `main.ts`: App entrypoint. Boots the game and wires global startup.
- `vite-env.d.ts`: Vite TypeScript environment declarations.
- `styles/app.css`: Global styling used by the app shell/UI.
- `game/`: Gameplay runtime code (scenes, systems, entities, registries, and feature modules).

## `game/` Folder Map

- `scenes/`: Phaser scene lifecycle and orchestration.
  - `BootScene.ts`: Initialization/preload and early setup flow.
  - `GameScene.ts`: Main gameplay scene that coordinates runtime systems.
- `layout/`: Play area layout and sizing concerns.
  - `Playfield.ts`: Defines gameplay viewport/playfield geometry.
- `components/`: Game systems and UI controllers that run within scene update loops.
  - `EnemySpawner.ts`: Enemy spawn scheduling/creation logic.
  - `AutoFireSystem.ts`: Automated player firing system.
  - `CollisionSystem.ts`: Hit/collision resolution pipeline.
  - `ShipSelectorUI.ts`: Ship selection UI controller.
  - `TouchController.ts`: Touch input adapter/controller.
- `objects/`: Concrete runtime game entities.
  - `PlayerShip.ts`: Player ship object.
  - `EnemyShip.ts`: Enemy ship object.
  - `PlayerBullet.ts`: Player projectile object.
  - `StarfieldLayer.ts`: Scrolling/parallax background layer.
- `ships/`: Playable ship domain model and registration.
  - `ShipDefinition.ts`: Ship configuration/type contract.
  - `ShipRegistry.ts`: Central registry for available ships.
  - `modules/`: Ship-specific implementations (`BulwarkShip`, `InterceptorShip`, `LancerShip`, `SolarSpiralShip`).
- `bullets/`: Bullet behavior abstraction and implementations.
  - `BulletBehavior.ts`: Behavior interface/contract.
  - `BulletBehaviorRegistry.ts`: Registry for bullet behavior lookup/selection.
  - `modules/LinearBulletBehavior.ts`: Linear projectile behavior module.

## Dependency Direction (Expected)

- `scenes/` orchestrate `components/`, `layout/`, and `objects/`.
- `components/` operate on `objects/` and consult registries (`ships/`, `bullets/`) as needed.
- `modules/` folders provide pluggable concrete implementations behind stable contracts (`ShipDefinition`, `BulletBehavior`).

## Change Checklist

When editing architecture, update this file in the same change if any of the following occur:

- A new folder is added under `src/game/`.
- A file is moved between `scenes`, `components`, `objects`, `ships`, `bullets`, or `layout`.
- A new registry/contract/module pattern is introduced.
- The scene orchestration flow changes materially.
