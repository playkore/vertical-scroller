# Vertical Scroller — Current Game Design Document

## 1) Game Overview

**Vertical Scroller (CGA Edition)** is a portrait shooter built on Phaser Arcade physics. The player controls a single ship in a bounded center playfield, auto-fires continuously, and survives enemy movement patterns while pushing through timed level phases into a boss handoff. The game uses a strict 4-color CGA visual palette and retro UI style.

## 2) Core Pillars (As Implemented)

1. **Movement pattern mastery**: enemies primarily threaten through positional pressure and pathing complexity rather than projectile spam.
2. **Auto-fire loadout expression**: ship switching changes bullet geometry/behavior and can be upgraded per ship.
3. **Timeline pacing**: each level defines phase-based spawn cadence and weighted enemy pools, then transitions into boss resolution.
4. **Arcade readability**: short feedback loops (screen shake, tint flash, score ticks, compact HUD) keep outcomes clear.

## 3) Runtime Structure

### Scene flow

1. **BootScene**: Generates all ship/enemy/boss/powerup textures and starfield assets at runtime.
2. **StartScene**: Main menu (`NEW GAME`, `LEVELS`, `ENEMIES`; `CONTINUE` currently disabled).
3. **GameScene**: Main gameplay loop.
4. **LevelSummaryScene**: Shows per-level stats and routes to next level or start screen.

Additional menus:
- **LevelSelectScene**: Paged level picker.
- **EnemiesScene**: Paged enemy codex with icon + name.

### Playfield layout

- Base game resolution is **360 x 640** (scaled to fit viewport).
- Gameplay happens in a center lane with side panels on left/right.
- Side panel width is adaptive (10% of screen width), clamped to **24–52 px** each side.

## 4) Core Gameplay Loop

1. Player ship enters from below to center.
2. Touch/mouse drag sets movement target; ship lerps toward it.
3. Auto-fire emits bullets based on active ship + weapon level.
4. LevelDirector spawns enemies by active phase timing and weighted roll.
5. CollisionSystem resolves overlaps:
   - Bullet vs enemy: both removed, +10 score, enemy kill stat++, possible powerup drop.
   - Bullet vs boss: bullet removed, boss HP -1; on defeat +500 score, boss kill stat++.
   - Player vs enemy/boss: player is **not destroyed**; hit stat++, camera shake + brief tint flash.
   - Player vs powerup: powerup behavior applied.
6. At level duration end, boss spawns (if configured). Level clears once boss is gone (or immediately if no boss).
7. Player exits upward into summary scene.

## 5) Player Controls & Survivability

- Input model is pointer/touch-driven target movement.
- Pointer mapping is intentionally amplified:
  - Horizontal displacement from screen center is doubled.
  - Vertical displacement from screen bottom is doubled.
- Ship movement is smooth interpolation (`blend = clamp(dt * 12, 0..1)`).
- There is currently **no HP/lives/game-over fail state from damage**; hits are tracked as a performance stat.

## 6) Combat System Details

### Auto-fire and weapon scaling

- Firing is always on while gameplay is active.
- Each ship has:
  - `maxLevel`
  - `fireInterval` (target interval at max level)
  - projectile emitters (offset, texture, behavior, params)
- Fire cadence by weapon level is interpolated between:
  - **Level 1:** 1.0s interval
  - **Max level:** ship-defined `fireInterval`
- Ship-switch pickups increase that specific ship's weapon level by +1 (clamped to its max).
- Weapon levels are tracked **per ship**, so upgrades persist when swapping away and back.

### Bullet behavior framework

- Built-in behavior: `linear` velocity.
- Ship-specific custom behaviors are registered through ship modules:
  - `flame-stream` (randomized cone-ish spread + short range with scaling).
  - `solar-expanding-spiral` (orbiting bullets around a moving center with expanding radius).

### Damage model

- Regular enemies: effectively 1 HP (any player bullet overlap destroys them).
- Bosses: explicit HP pools.
- Player damage: feedback-only (stat + visuals), no death state currently.

## 7) Ship Roster and Weapon Identity

| Ship | Code | Fire Interval (max level) | Projectile Pattern | Role Summary |
|---|---|---:|---|---|
| **Bulwark** | BLW | 0.32s | 2 slow orb shots (stacked vertical emitters) | Stable lane pressure, lower reach speed |
| **Flamethrower** | FLAME | 0.10s | 6 flame emitters with jittered trajectories and short lifetime/range | Very high close-range DPS cone |
| **Interceptor** | INT | 0.12s | 2 fast vertical lasers | Precision lane deletion |
| **Lancer** | LNC | 0.20s | 3-shot spread (left, center, right) with mixed velocities | Mid-width screen control |
| **Solar Spiral** | SUN | 0.24s | 2 mirrored expanding spiral bullets | Area denial and curved trajectory coverage |

## 8) Powerups (Current Implementation)

### Ship switch pickups
Collecting a ship switch pickup:
1. switches to that ship,
2. increments that ship’s weapon level by 1,
3. updates HUD weapon level text.

Switch pickups:
- `SWITCH BLW`
- `SWITCH FLAME`
- `SWITCH INT`
- `SWITCH LNC`
- `SWITCH SUN`

### Utility pickups
- `SIGNAL SCRAP`: currently inert placeholder effect.
- `FLUX BATTERY`: currently inert placeholder effect.

### Drop logic
- Levels define **drop quotas per powerup**.
- PowerupDropDirector adaptively ramps drop chance using remaining quota vs estimated remaining kills.
- If remaining drops >= estimated remaining kills, drops become forced to preserve quota completion.

## 9) Enemy System and Behaviors

> Important: enemies currently do **not** fire bullets. Threat is movement/pathing + collisions.

| Enemy | Code | Behavior (Current) |
|---|---|---|
| Raider | RDR | Straight downward descent at high speed. |
| Saw Drift | SAW | Downward drift + lateral bounce off playfield edges. |
| Wave Eel | WVE | Downward movement with sine-wave lateral oscillation. |
| Hunter | HNT | Tracks player X while descending. |
| Berserk Reaver | BRV | Alternates timed chase and retreat phases while tracking player X. |
| Yo-Yo Striker | YYO | Moves down then up between min/max Y bounds in repeating cycles. |
| Sniper Lock | SNL | Slow lock phase, then single high-speed dash toward sampled player vector, then cooldown drift. |
| Orbit Diver | ORB | Approach to anchor, orbit phase for ~2.4s, then downward dive with tracking. |
| Splitter | SPL | Descends with periodic horizontal direction swaps; no child spawn implemented yet. |
| Shield Front | SHF | Mild X tracking + descent; directional damage reduction not implemented yet. |
| Pulse Ram | PLS | Pulsing vertical speed (sin-cycle bursts) with lateral tracking. |
| Mine Layer | MNL | Wavy downward movement; mine deployment not implemented yet. |
| Feign Retreat | FGR | Timed press -> retreat upward -> fast return cycle with lateral tracking. |
| Lane Jammer | LJM | Snaps toward lane center, conditionally hops adjacent lane when aligned with player. |
| Gravity Well | GRW | Slow drift/sway descent; gravity pull effect not implemented yet. |
| Escort Core | ESC | Swaying descent; escort drones/shield gating not implemented yet. |
| Undercut Hunter | UND | Drops deep, then switches to upward pursuit from below. |
| Boid Flock | BOI | Flocking AI (cohesion/alignment/separation), boundary steering, bullet-avoidance impulses. |

## 10) Bosses

| Boss | HP | Behavior |
|---|---:|---|
| Tiny Core | 20 | Enters from top, then small horizontal hover oscillation near top lane. |
| Alpha Core | 180 | Enters from top, then broad horizontal hover sweep with vertical bob. |

Bosses currently do not fire projectiles; they act as high-HP positional hazards.

## 11) Progression and Level Catalog

Levels are data-driven timelines with phased enemy pools, random cadence windows, powerup quotas, and optional boss handoff.

| ID | Name | Duration | Boss |
|---|---|---:|---|
| `level-00-short-level-test` | SHORT LEVEL TEST | 4s | Tiny Core |
| `level-01` | NEON FRONTIER | 105s | Alpha Core |
| `level-02` | HUNTER WAKE | 120s | Alpha Core |
| `level-03` | OSCILLATION RUN | 120s | Alpha Core |
| `level-04` | DIVER SPLIT | 135s | Alpha Core |
| `level-05` | ARMOR PULSE | 135s | Alpha Core |
| `level-06` | MINES AND FEINTS | 150s | Alpha Core |
| `level-07` | JAMMER CORRIDOR | 150s | Alpha Core |
| `level-08` | GRAVITY ARC | 165s | Alpha Core |
| `level-09` | ESCORT PINCER | 165s | Alpha Core |
| `level-10` | FINAL GAUNTLET | 180s | Alpha Core |
| `level-11` | BOID STORM | 18s | None |
| `level-99-boss-test` | BOSS TEST | 4s | Alpha Core |

## 12) Scoring and End-of-Level Stats

- +10 score per regular enemy destroyed.
- +500 score per boss defeat.
- Stats shown in summary:
  - Score
  - Enemies destroyed
  - Bosses defeated
  - Hits taken

## 13) Current Design Gaps / Opportunities (From Existing Code)

These are implied mechanics in naming/theme but not yet mechanically active:

1. Enemy projectile systems (none implemented).
2. Player failure condition (hits are non-lethal currently).
3. Several enemy fantasy hooks currently represented as movement-only approximations:
   - Shield Front directional armor,
   - Splitter child split-on-death,
   - Mine Layer mine objects,
   - Gravity Well force field,
   - Escort Core drone/shield interaction.
4. Utility pickups (`Signal Scrap`, `Flux Battery`) have placeholder/no-op effects.
5. `CONTINUE` menu flow is present but disabled.

---

This document reflects the **current implemented behavior** in the repository, not aspirational design text.
