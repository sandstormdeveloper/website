---
title: ECS / Entities
---

# ECS / Entities

PixelStorm exposes a public ECS layer, but gameplay code normally works through `World` and `Entity`. That keeps the API readable while still leaving the registry available for lower-level use cases.

## `Entity`

`Entity` is a lightweight handle to a real object in the registry. It does not own the component data itself; it only points to it.

### Lifecycle

| Method | What it does |
| --- | --- |
| `GetId()` | returns the numeric identifier |
| `IsValid()` | checks whether the entity is still alive |
| `Destroy(logDestruction)` | marks the entity for destruction |

Destroyed entities disappear from normal gameplay queries immediately, and the actual component storage is released later when the registry flushes deferred destruction.

### Components

| Method | Use |
| --- | --- |
| `AddComponent<T>(...)` | creates or reuses a component |
| `HasComponent<T>()` | checks whether it exists |
| `GetComponent<T>()` | direct access |
| `RemoveComponent<T>()` | removes the component |

### High-Level Helpers

| Helper | Requires |
| --- | --- |
| `Transform()` | `Transform` |
| `Sprite()` | `SpriteRenderer` |
| `Collider()` | `Collider` |
| `Rigidbody()` | `Rigidbody` |
| `Trigger()` | `Collider` used as a trigger |
| `Animation()` | `Animator` |
| `Particles()` | `ParticleEmitter` |

:::important
The helpers throw if the required component does not exist.
Use `HasComponent<T>()` when the component is optional.
:::

### Example

```cpp
if (player.HasComponent<Rigidbody>())
{
    player.Rigidbody().SetVelocity(Vec2(120.0f, 0.0f));
}

player.Transform().SetPivot(Vec2(16.0f, 16.0f));
player.Sprite().FlipX(true);
```

## Proxies

The proxies group the most common component operations so gameplay code can stay readable.

### `Transform()`

| Method | Use |
| --- | --- |
| `GetPosition()` / `SetPosition()` / `Translate()` | move the entity |
| `GetScale()` / `SetScale()` | change visual size |
| `GetPivot()` / `SetPivot()` / `TranslatePivot()` | adjust the rotation point |
| `GetRotation()` / `SetRotation()` / `Rotate()` | rotation in degrees |

### `Sprite()`

| Method | Use |
| --- | --- |
| `GetColor()` / `SetColor()` | sprite tint |
| `GetTexture()` / `SetTexture()` / `ClearTexture()` | logical texture name |
| `FlipX()` / `FlipY()` / `SetFlip()` | mirroring |
| `IsVisible()` / `SetVisible()` / `Show()` / `Hide()` | visibility |
| `GetRenderOrder()` / `SetRenderOrder()` | draw layer |

### `Collider()`

| Method | Use |
| --- | --- |
| `GetSize()` / `SetSize()` | AABB size |
| `GetOffset()` / `SetOffset()` | offset from the transform |
| `IsTrigger()` / `SetTrigger()` | convert to sensor |

### `Rigidbody()`

| Method | Use |
| --- | --- |
| `GetVelocity()` / `SetVelocity()` / `AddVelocity()` | movement |
| `IsStatic()` / `SetStatic()` | immovable body |
| `UsesGravity()` / `SetUseGravity()` | gravity enabled or not |
| `GetGravityScale()` / `SetGravityScale()` | gravity multiplier |

### `Trigger()`

| Method | Use |
| --- | --- |
| `SetOnEnter()` | callback on enter |
| `SetOnStay()` | callback while overlapping |
| `SetOnExit()` | callback on exit |
| `ClearCallbacks()` | clears all callbacks |

### `Animation()`

| Method | Use |
| --- | --- |
| `AddClip()` / `RemoveClip()` / `HasClip()` | manage clips |
| `Play(name)` / `Play()` | start or resume playback |
| `Pause()` / `Stop()` / `Restart()` | playback control |
| `GetFrame()` / `SetFrame()` | current frame |
| `GetFPS()` / `SetFPS()` | playback speed |
| `IsLooping()` / `SetLoop()` | looping |
| `GetFrameSize()` / `SetFrameSize()` | frame size |
| `GetFrameCount()` / `SetFrameCount()` | number of frames |
| `GetFramesPerRow()` / `SetFramesPerRow()` | spritesheet layout |

### `Particles()`

| Method | Use |
| --- | --- |
| `Play()` / `Pause()` / `Stop()` | activate or clear emission |
| `IsPlaying()` | active state |
| `IsLooping()` / `SetLoop()` | auto-emission loop |
| `IsAutoEmitting()` / `SetAutoEmit()` | continuous emission |
| `GetBurstCount()` / `SetBurstCount()` | burst size |
| `GetEmitRate()` / `SetEmitRate()` | emission rate |
| `EmitBurst(count)` | requests extra bursts |

## `Registry`

`Registry` is the lower-level ECS layer. It is public, but `World` is usually the better gameplay entry point.

### When To Use It

- when you need to query many entities by components
- when you want to name entities or clear ECS state manually
- when you are building tools or lower-level systems

### Main API

| Method | Use |
| --- | --- |
| `CreateEntity()` | creates a new entity |
| `CreateEntity(name)` | creates an entity with a name |
| `DestroyEntity(entity)` | destroys an entity |
| `FlushDestroyedEntities()` | releases deferred storage |
| `GetEntitiesWith<...>()` | queries entities by components |
| `SetEntityName()` / `GetEntityName()` | debug naming |
| `Clear()` | clears all ECS state |

### Useful Rule

When you want to remove an entity during gameplay, it is safe to call `Destroy()` or `World::DestroyEntity()` from scene logic or trigger callbacks. The registry will mark it as removed from gameplay queries and clean the storage later in a controlled way.

:::note
In normal gameplay, `World` already gives you the high-level operations you usually need without touching `Registry` directly.
:::
