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
  - `StartScene.ts`: Main menu scene (`Continue`, `New Game`, `Levels`).
  - `LevelSelectScene.ts`: Level selection scene that starts a chosen level.
  - `GameScene.ts`: Main gameplay scene that coordinates runtime systems.
- `layout/`: Play area layout and sizing concerns.
  - `Playfield.ts`: Defines gameplay viewport/playfield geometry.
- `components/`: Game systems and UI controllers that run within scene update loops.
  - `MenuButton.ts`: Reusable menu button UI element for front-end scenes.
  - `EnemySpawner.ts`: Enemy spawn scheduling/creation logic.
  - `BossSpawner.ts`: Boss spawn lifecycle and active boss group management.
  - `LevelDirector.ts`: Level timeline controller that deploys enemy waves/phases.
  - `LevelProgressBar.ts`: Level progress UI renderer in the side panel.
  - `AutoFireSystem.ts`: Automated player firing system.
  - `CollisionSystem.ts`: Hit/collision resolution pipeline.
  - `ShipSelectorUI.ts`: Ship selection UI controller.
  - `TouchController.ts`: Touch input adapter/controller.
- `objects/`: Concrete runtime game entities.
  - `PlayerShip.ts`: Player ship object.
  - `EnemyShip.ts`: Enemy ship object.
  - `BossShip.ts`: Boss runtime object with health and movement behavior hooks.
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
- `enemies/`: Enemy domain model, behavior contracts, and module registry.
  - `EnemyDefinition.ts`: Enemy configuration/type contract.
  - `EnemyRegistry.ts`: Central registry for available enemies.
  - `modules/`: Enemy-specific implementations (`RaiderEnemy`, `SawDriftEnemy`, `WaveEelEnemy`).
- `bosses/`: Boss domain model, behavior contracts, and module registry.
  - `BossDefinition.ts`: Boss configuration/type contract.
  - `BossRegistry.ts`: Central registry for available bosses.
  - `modules/`: Boss-specific implementations (`AlphaCoreBoss`).
- `levels/`: Level domain model and module registry.
  - `LevelDefinition.ts`: Level configuration/type contract (phases, duration, boss id).
  - `LevelRegistry.ts`: Central registry for available levels.
  - `modules/Level01NeonFrontier.ts`: First level timeline and enemy rollout rules.
  - `modules/Level99BossTest.ts`: Short boss-test timeline for rapid boss iteration.
- `style/`: Shared visual constants.
  - `CgaPalette.ts`: Canonical CGA 4-color palette constants.

## Dependency Direction (Expected)

- `scenes/` orchestrate `components/`, `layout/`, and `objects/`.
- `components/` operate on `objects/` and consult registries (`ships/`, `bullets/`, `enemies/`, `bosses/`, `levels/`) as needed.
- `modules/` folders provide pluggable concrete implementations behind stable contracts (`ShipDefinition`, `BulletBehavior`, `EnemyDefinition`, `BossDefinition`, `LevelDefinition`).

## Visual Directive

- Use only the 4-color CGA palette used by this project across all visual elements (gameplay objects, bullets, borders, HUD, and UI buttons): `#000000`, `#55ffff`, `#ff55ff`, `#ffffff`.
- Do not introduce ad-hoc colors; prefer importing shared palette constants from `game/style/CgaPalette.ts`.

## Documentation Directive

- Add concise, meaningful comments for data structures (types/interfaces/config objects) so their purpose and fields are clear.
- Add explanatory comments in implementation code where behavior is non-obvious (timing rules, movement logic, selection/weighting, lifecycle flow).
- Avoid redundant comments; focus on intent and reasoning rather than restating syntax.

## Change Checklist

When editing architecture, update this file in the same change if any of the following occur:

- A new folder is added under `src/game/`.
- A file is moved between `scenes`, `components`, `objects`, `ships`, `bullets`, `enemies`, `bosses`, `levels`, or `layout`.
- A new shared style/theme folder is added (for example `game/style/`).
- A new registry/contract/module pattern is introduced.
- The scene orchestration flow changes materially.
