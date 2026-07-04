---
title: Particles
---

# Particles

PixelStorm's particle system creates lightweight entities for visual effects.

## `Particle`

`Particle` stores the state of a live particle.

| Field | Use |
| --- | --- |
| `Velocity` | current velocity |
| `Lifetime` | total lifetime |
| `Age` | time already lived |
| `StartColor` / `EndColor` | color interpolation |
| `StartScale` / `EndScale` | scale interpolation |
| `GravityScale` | per-particle gravity |

### Defaults

| Field | Default |
| --- | --- |
| `Lifetime` | `1.0f` |
| `Age` | `0.0f` |
| `StartColor` | opaque white |
| `EndColor` | transparent white |
| `StartScale` | `(4, 4)` |
| `EndScale` | `(1, 1)` |
| `GravityScale` | `0.0f` |

## `ParticleEmitter`

`ParticleEmitter` defines how particles are spawned.

| Field | Default | Use |
| --- | --- | --- |
| `Active` | `true` | whether it can emit |
| `Loop` | `false` | whether it auto-emits cyclically |
| `AutoEmit` | `false` | whether it emits over time |
| `BurstCount` | `8` | particles per burst |
| `EmitRate` | `0.0f` | bursts per second |
| `Lifetime` | `0.75f` | lifetime of each particle |
| `Speed` | `80.0f` | base speed |
| `SpeedVariation` | `20.0f` | random variation |
| `Spread` | `180.0f` | angular spread |
| `RenderOrder` | `0` | draw layer |

## `ParticleEmitterProxy`

`Entity::Particles()` returns the emitter control proxy.

| Method | Use |
| --- | --- |
| `Play()` | enables automatic emission |
| `Pause()` | pauses without clearing pending bursts |
| `Stop()` | stops and clears pending bursts |
| `IsPlaying()` | active state |
| `IsLooping()` / `SetLoop()` | auto-emission loop |
| `IsAutoEmitting()` / `SetAutoEmit()` | continuous emission |
| `GetBurstCount()` / `SetBurstCount()` | burst size |
| `GetEmitRate()` / `SetEmitRate()` | emission rate |
| `GetLifetime()` / `SetLifetime()` | lifetime |
| `GetSpeed()` / `SetSpeed()` | base speed |
| `GetSpeedVariation()` / `SetSpeedVariation()` | variation |
| `GetSpread()` / `SetSpread()` | spread |
| `GetStartColor()` / `SetStartColor()` | start color |
| `GetEndColor()` / `SetEndColor()` | end color |
| `GetStartScale()` / `SetStartScale()` | start scale |
| `GetEndScale()` / `SetEndScale()` | end scale |
| `GetGravityScale()` / `SetGravityScale()` | gravity |
| `GetTexture()` / `SetTexture()` | texture name |
| `GetRenderOrder()` / `SetRenderOrder()` | draw order |
| `EmitBurst(count)` | requests extra bursts |

### `EmitBurst`

- `count <= 0` is ignored
- bursts are accumulated in `PendingBursts`
- the system consumes them on the next update

## System

`ParticleSystem`:

- spawns particles from active emitters
- animates color, scale, and position
- destroys expired particles

### Example

```cpp
Entity fx = GetWorld().CreateParticleEmitter(
    "Dust",
    Vec2(200.0f, 180.0f),
    "spark",
    8,
    0.5f,
    90.0f,
    20.0f,
    180.0f,
    glm::vec4(1.0f, 0.8f, 0.2f, 1.0f),
    glm::vec4(1.0f, 0.2f, 0.0f, 0.0f));

fx.Particles().EmitBurst(12);
```

:::note
Particles are rendered as normal entities with `Transform`, `SpriteRenderer`, and `Particle`.
That makes them easy to integrate with the existing renderer.
:::
