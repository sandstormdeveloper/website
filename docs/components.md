---
title: Components
---

# Components

These are the data components you will use most often from gameplay code.

## `Transform`

`Transform` defines where an entity is and how it is drawn.

| Field | Default | Use |
| --- | --- | --- |
| `Position` | `(0, 0)` | world position |
| `Scale` | `(1, 1)` | per-axis scale |
| `Rotation` | `0` | rotation in degrees |
| `Pivot` | `(0, 0)` | local rotation and scale pivot |

### `GetMatrix()`

Builds the full model matrix using:

1. position
2. pivot
3. rotation
4. scale
5. inverse pivot

### Example

```cpp
player.Transform().SetPivot(Vec2(16.0f, 16.0f));
player.Transform().Rotate(90.0f);
```

:::tip
The `Pivot` is useful when you want to rotate around the center of a sprite or around a character's feet.
:::

## `SpriteRenderer`

`SpriteRenderer` controls the visual part of an entity.

| Field | Default | Use |
| --- | --- | --- |
| `TextureName` | empty | logical texture name |
| `Color` | white | RGBA tint |
| `Visible` | `true` | draw or not |
| `RenderOrder` | `0` | layer order |
| `SourceRect` | `0,0,0,0` | texture region in pixels |
| `FlipX` | `false` | horizontal mirroring |
| `FlipY` | `false` | vertical mirroring |

### Notes

- if `TextureName` is empty, the engine uses the fallback texture
- if `SourceRect` is empty, the full texture is drawn
- a lower `RenderOrder` is drawn first

### Example

```cpp
sprite.Sprite().SetColor(Colors::Blue());
sprite.Sprite().FlipX(true);
sprite.Sprite().SetRenderOrder(50);
```

## `Collider`

`Collider` defines an AABB for physics and triggers.

| Field | Default | Use |
| --- | --- | --- |
| `Size` | `(1, 1)` | collider size |
| `Offset` | `(0, 0)` | offset relative to the transform |
| `IsTrigger` | `false` | sensor without physical blocking |
| callbacks | empty | trigger events |

### Important

`Collider` is axis-aligned.

- it does not rotate with `Transform::Rotation`
- it does not scale with `Transform::Scale`
- it is computed from `Transform::Position + Offset` and `Size`

### Example

```cpp
box.Collider().SetSize(Vec2(32.0f, 48.0f));
box.Collider().SetOffset(Vec2(0.0f, 8.0f));
box.Trigger().SetTrigger(true);
```

## `Rigidbody`

`Rigidbody` controls the dynamic part of physics.

| Field | Default | Use |
| --- | --- | --- |
| `Velocity` | `(0, 0)` | current speed |
| `IsStatic` | `false` | whether the body moves through physics |
| `UseGravity` | `false` | whether global gravity affects it |
| `GravityScale` | `25.0f` | gravity multiplier |

### Example

```cpp
player.Rigidbody().SetUseGravity(true);
player.Rigidbody().SetVelocity(Vec2(180.0f, 0.0f));
```

:::note
The engine's collisions are AABB based. If you need real rotating physics or complex colliders, the current public API does not expose them.
:::
