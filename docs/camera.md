---
title: Camera
---

# Camera

PixelStorm uses a 2D orthographic camera. That choice fits the engine well because it keeps the projection simple, makes pixel-art scenes easier to reason about, and lines up naturally with the logical resolution used by the rest of the API.

## `Camera2D`

### Construction

```cpp
Camera2D camera(-320.0f, 320.0f, 180.0f, -180.0f);
```

The constructor defines the initial orthographic bounds. In the default engine setup, those bounds are derived from the initial window size.

### Public API

| Method | Use |
| --- | --- |
| `SetProjection(left, right, bottom, top)` | changes the orthographic bounds |
| `SetPosition(position)` | moves the camera in world space |
| `SetRotation(rotationDegrees)` | rotates the camera around Z |
| `GetPosition()` | current position |
| `GetRotation()` | current rotation |
| `GetProjectionMatrix()` | projection matrix |
| `GetViewMatrix()` | view matrix |
| `GetViewProjectionMatrix()` | combined matrix |

### When To Use It

- use `Application::SetCameraPosition()` for simple camera adjustments
- use `GetCamera()` when you need direct camera access
- use `FollowCamera()` when the camera should track an entity automatically

## Coordinates

With the default `Application` projection:

- the origin is centered on screen
- one unit usually corresponds to one logical pixel
- positive vertical direction points downward in the gameplay logic used by the engine

:::note
That matches `Input::GetAxis2D()` and the patterns used in the demo.
:::

## Camera Follow

`Application::FollowCamera()` is the recommended way to track an entity.

| Parameter | Use |
| --- | --- |
| `entity` | target to follow |
| `offset` | relative offset from the target |
| `followRotation` | whether the camera copies the target rotation |
| `followSpeed` | smoothing amount |

### Behavior

- if the entity is invalid, follow is canceled
- if the target loses `Transform`, follow is canceled
- if `followSpeed <= 0`, follow becomes instant

### Example

```cpp
GetApplication().FollowCamera(player, Vec2(0.0f, 0.0f), false, 8.0f);
```

## Useful Patterns

### Fixed HUD and World Text

```cpp
UI::Print("HUD", Vec2(12.0f, 12.0f), Colors::White(), 1.0f, false);
UI::Print("Enemy", enemy.Transform().GetPosition(), Colors::Red(), 1.0f, true);
```

### Projectile Cleanup

```cpp
if (GetApplication().IsPositionOutsideCamera(bullet.Transform().GetPosition(), 32.0f))
{
    bullet.Destroy(false);
}
```

### Aim With Mouse

```cpp
const Vec2 mouseWorld = Input::GetMouseWorldPosition(GetApplication().GetCamera());
const Vec2 aimDirection = mouseWorld - gun.Transform().GetPosition();
gun.Transform().SetRotation(Degrees(Atan2(aimDirection.y, aimDirection.x)));
```

### Instant Camera Snap

```cpp
GetApplication().FollowCamera(player, Vec2(0.0f, 0.0f), false, 0.0f);
```

:::tip
Use `followSpeed = 0` only if you want an immediate camera snap.
:::
