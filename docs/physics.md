---
title: Physics
---

# Physics

PixelStorm exposes AABB physics, gravity, and triggers. The system is deliberately simple, but it is enough to support movement, obstacle blocking, and scene interaction for a 2D game.

## `Collision`

`Collision` works on axis-aligned boxes.

| Method | Use |
| --- | --- |
| `CreateAABB(transform, collider)` | builds the world-space box |
| `Overlaps(a, b)` | checks overlap |
| `CheckAABB(a, b)` | returns a collision manifold |

### `CollisionManifold`

| Field | Meaning |
| --- | --- |
| `IsColliding` | whether the boxes overlap |
| `Normal` | separation direction |
| `PenetrationDepth` | minimum distance needed to separate the boxes |

### Important

`CreateAABB()` uses:

- `Transform::Position`
- `Collider::Offset`
- `Collider::Size`

It does not use rotation or scale from the transform.

:::warning
This means the engine's public physics is deliberately simple and axis-aligned.
If you rotate a sprite, the collider remains an AABB.
:::

## `Physics`

`Physics` applies integration and collision resolution.

| Method | What it does |
| --- | --- |
| `Integrate(transform, rigidbody, deltaTime)` | applies velocity to position |
| `ResolveAABB(dynamic, static, ...)` | resolves a dynamic body against a static body |
| `ResolveAABB(first, second, ...)` | resolves two dynamic bodies |

### Rules

- static bodies are not integrated
- triggers do not block movement
- resolution separates bodies along the axis of smallest penetration
- velocity is cleared on the collision axis

## `PhysicsSystem`

`PhysicsSystem` is the system that `Application::Run()` updates automatically.

### Public API

| Method | Use |
| --- | --- |
| `PhysicsSystem()` | creates the system with default gravity |
| `Update(registry, deltaTime)` | integrates, resolves, and gathers triggers |
| `SetGravity()` / `GetGravity()` | controls global gravity |
| `GetTriggerEvents()` | returns the events from the last frame |
| `GetTriggerEventsFor(entity)` | filters trigger events for one entity |

### Default Gravity

`PhysicsSystem` starts with:

```cpp
Vec2(0.0f, 980.0f)
```

That gives the engine a platformer-like gravity feel by default.

### Trigger Events

`TriggerEventType` can be:

- `Enter`
- `Stay`
- `Exit`

`TriggerEvent` exposes:

- `Type`
- `First`
- `Second`
- `Involves(entity)`
- `Other(entity)`

### Example

```cpp
for (const TriggerEvent &event : GetPhysicsSystem().GetTriggerEventsFor(player))
{
    if (event.Type == TriggerEventType::Enter)
    {
        Log::Debug("entered trigger");
    }
}
```

## Triggers

To use a trigger in practice:

1. create an entity with `CreateStaticBox(..., true)`
2. register callbacks with `Entity::Trigger()`
3. or read events from `GetTriggerEventsFor()`

### Callback Example

```cpp
zone.Trigger().SetOnEnter([&](Entity other)
{
    if (other.GetId() == player.GetId())
    {
        Log::Debug("player entered zone");
    }
});
```

:::tip
Trigger callbacks receive the other entity involved in the overlap.
That makes it easy to filter by ID or by component presence.
:::
