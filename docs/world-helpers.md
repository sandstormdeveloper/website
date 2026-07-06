---
title: World Helpers
---

# World Helpers

`World` is the recommended way to create entities from gameplay code. Instead of assembling every component manually, the helper methods create a useful starting point for the kind of object you want to build.

## World State

| Method | Use |
| --- | --- |
| `IsValid()` | checks whether the world is connected to a registry |
| `Clear()` | removes all entities and components |
| `DestroyEntity(entity)` | destroys one entity |

:::warning
`World` is only valid when it is connected to the game's `Registry`.
Inside `Application` this is already set up for you.
:::

## Basic Creation

| Method | Components created |
| --- | --- |
| `CreateEntity()` | none |
| `CreateEntity(name)` | none, but with a debug name |

Use these when you want to assemble the entity manually.

## Sprites and Actors

| Method | What it creates |
| --- | --- |
| `CreateSprite()` | `Transform` + `SpriteRenderer` |
| `CreateActor()` | `Transform` + `SpriteRenderer` + `Collider` + `Rigidbody` |
| `CreateStaticBox()` | `Transform` + `SpriteRenderer` + `Collider` + static `Rigidbody` |
| `CreateAnimatedActor()` | `Transform` + `SpriteRenderer` + `Collider` + `Rigidbody` + `Animator` |
| `CreateAnimatedSprite()` | compatibility helper for a single-clip animated actor |

### `CreateSprite`

```cpp
Entity tree = GetWorld().CreateSprite(
    "Tree",
    Vec2(120.0f, 200.0f),
    Vec2(32.0f, 32.0f),
    Colors::White(),
    "tree");
```

### `CreateActor`

`CreateActor()` creates a dynamic entity with AABB collision.

- `Rigidbody::IsStatic = false`
- `Collider::IsTrigger = false`
- the sprite remains visible

### `CreateStaticBox`

`CreateStaticBox()` creates an immovable entity.

| Parameter | Use |
| --- | --- |
| `isTrigger` | if `true`, the box detects overlaps but does not block movement |

### `CreateAnimatedActor`

`CreateAnimatedActor()` is the most complete helper for characters:

- creates a visible sprite
- adds a collider
- adds a dynamic rigidbody
- adds an animator
- registers clips
- plays the initial clip if it exists

If `initialClip` does not exist, it falls back to the first clip in the map if one is available.

### `CreateAnimatedSprite`

This is a compatibility version that builds a single clip named `default`.

:::tip
If you already have multiple clips or a character with multiple states, use `CreateAnimatedActor()` directly.
If you only need a simple animation, `CreateAnimatedSprite()` is enough.
:::

## Particles

| Method | Use |
| --- | --- |
| `CreateParticleEmitter()` | creates an independent emitter |

### Important Defaults

| Field | Default |
| --- | --- |
| `Active` | `true` |
| `Loop` | `false` |
| `AutoEmit` | `false` |
| `BurstCount` | `8` |
| `Lifetime` | `0.75f` |
| `Speed` | `80.0f` |
| `Spread` | `180.0f` |

### Example

```cpp
Entity emitter = GetWorld().CreateParticleEmitter(
    "Hit FX",
    player.Transform().GetPosition(),
    "spark",
    12,
    0.4f,
    120.0f,
    25.0f,
    220.0f,
    Vec4(1.0f, 0.9f, 0.3f, 1.0f),
    Vec4(1.0f, 0.2f, 0.1f, 0.0f));

emitter.Particles().EmitBurst(1);
```

### When To Use It

- use `CreateSprite()` for props and static visuals
- use `CreateActor()` for movable bodies
- use `CreateStaticBox()` for walls and triggers
- use `CreateAnimatedActor()` for characters with multiple clips

:::note
Particles are created as independent entities with `Transform`, `SpriteRenderer`, and `Particle`.
:::
