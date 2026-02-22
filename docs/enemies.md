# Regular

## RDR (Raider)

### Behavior

Flies straight down with no lateral movement. It is the most direct pressure enemy and usually appears as a quick lane check because of its higher vertical speed.

### Appearance

Compact 16x16 pixel craft with a magenta body, plus white top and bottom accents. It reads as a blunt, blocky attacker.

## SAW (Saw Drift)

### Behavior

Moves downward while drifting sideways. When it reaches the playfield edges, it bounces and reverses horizontal direction, so it can sweep across multiple lanes in one life.

### Appearance

Flat, blade-like shape: white main body, cyan center stripe, and a magenta top detail. Its silhouette emphasizes lateral movement.

## WVE (Wave Eel)

### Behavior

Descends while weaving left and right in a sine-wave pattern. Each spawn randomizes wave amplitude and frequency, making its path less predictable.

### Appearance

Tall cyan center body with white side fins and a magenta head cap. The narrow vertical profile supports the “eel” identity.

# Draft Additions

## HNT (Hunter)

### Behavior

Spawns at the top and immediately steers toward the player's current ship position, prioritizing direct interception over lane-based movement. After acquiring a line, it keeps pressing the player with aggressive chase movement.

### Appearance

Sharp forward-pointing silhouette with a bright nose marker and narrow side wings, so the enemy reads as a focused pursuit craft.

## BRV (Berserk Reaver)

### Behavior

Uses the same top-down pursuit pattern as HNT, but has a fear/recover state. If it is hit and survives the shot (remaining HP is still above zero), it breaks off and moves away from the player for 3 seconds, then resumes active pursuit.

### Appearance

Heavier variant of the hunter shape with reinforced body panels and a high-contrast core, signaling higher durability and state-based behavior.

## YYO (Yo-Yo Striker)

### Behavior

Drops from the top toward the lower playfield, then reverses and climbs back up, repeating this down-up cycle continuously until destroyed. Horizontal movement is minimal so its threat comes from vertical timing and re-entry loops.

### Appearance

Tall, symmetrical frame with strong top and bottom visual anchors, making the enemy's vertical oscillation obvious at a glance.

## SNL (Sniper Lock)

### Behavior

Enters at low speed and paints a short lock-on line toward the player's current position for about 1 second. After locking, it performs a single fast dash along that exact vector, then returns to normal drift speed.

### Appearance

Narrow body with a bright front "scope" pixel and thin side rails, so it reads as an aiming unit before the burst.

## ORB (Orbit Diver)

### Behavior

Approaches the player, then switches into a medium-radius circular orbit for 2-3 seconds. When the orbit timer ends, it exits with a committed downward strike.

### Appearance

Round core with offset side fins to suggest rotational motion, plus a highlighted lower spike to telegraph the dive phase.

## SPL (Splitter)

### Behavior

Acts like a standard descending enemy while alive. On death, it spawns two smaller child ships that fly diagonally down-left and down-right with reduced HP and damage.

### Appearance

Segmented chassis with a visible center seam, visually implying that the hull can split into two pieces.

## SHF (Shield Front)

### Behavior

Descends with mild tracking but has directional armor: shots from its forward-facing arc deal reduced damage, while shots from side or rear windows deal normal damage.

### Appearance

Large frontal plate and smaller exposed rear engine block, making the weak-side concept readable in motion.

## PLS (Pulse Ram)

### Behavior

Alternates between short glide phases and acceleration bursts roughly every 1.5 seconds. The pulse rhythm forces timing-based dodges rather than constant-speed evasion.

### Appearance

Compact battering-ram silhouette with animated rear thruster pixels that flare during each acceleration pulse.

## MNL (Mine Layer)

### Behavior

Moves downward in a zig-zag pattern and drops stationary mines at fixed intervals. Mines persist for a short time, creating temporary denial zones behind its path.

### Appearance

Wide utility hull with underside release ports and small warning lights that blink when a mine is deployed.

## FGR (Feign Retreat)

### Behavior

Presses toward the player until it takes damage, then immediately retreats upward for a short duration. After retreat, it re-enters with increased speed and repeats the bait-and-reengage loop.

### Appearance

Predatory wedge frame with an emphasized rear exhaust cluster, supporting the fast reverse-and-return identity.

## LJM (Lane Jammer)

### Behavior

Selects a lane and tracks vertically inside it. When roughly aligned with the player, it performs a sudden one-lane side hop to break prediction and block nearby escape routes.

### Appearance

Boxy lane-marker body with strong left/right side pods that visually sell abrupt horizontal lane jumps.

## GRW (Gravity Well)

### Behavior

Slow-moving anchor enemy that creates a local pull field while alive. The field slightly bends nearby bullets and tugs player movement input toward the enemy.

### Appearance

Heavy circular core surrounded by ring-like accents, conveying a stable field generator rather than a fast attacker.

## ESC (Escort Core)

### Behavior

Spawns with two side drones that escort and fire in support. The core remains shielded until at least one escort drone is destroyed, then becomes vulnerable.

### Appearance

Central command hull flanked by two smaller wing drones connected by spacing that clearly reads as a formation unit.

## UND (Undercut Hunter)

### Behavior

Drops straight down past the player first, then flips into upward pursuit from below the ship. This attack angle is harder to shoot because the enemy tracks from the player's lower blind-pressure zone.

### Appearance

Arrow-like craft with mirrored top/bottom detailing and a bright underside sensor, highlighting its below-player chase role.
