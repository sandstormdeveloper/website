---
title: Input
---

# Input

`Input` handles keys, mouse, named actions, and axes.

## Basic API

| Method | Use |
| --- | --- |
| `SetWindow(GLFWwindow *window)` | connects the input backend to the window |
| `Update()` | captures the current frame snapshot |
| `IsKeyDown()` | key currently held |
| `IsKeyJustPressed()` | up-to-down transition |
| `IsKeyJustReleased()` | down-to-up transition |
| `IsMouseButtonDown()` | mouse button currently held |
| `GetMousePosition()` | cursor position in logical space |
| `GetMouseDelta()` | cursor movement between frames |

:::important
`SetWindow()` is called for you by `Application`.
In a normal game you should not touch it unless you are building your own GLFW layer.
:::

## Keys and mouse

`Key` exposes a small but useful selection:

- `Space`
- `A` to `Z`
- `Escape`
- `F3`
- arrows: `Left`, `Right`, `Up`, `Down`

`MouseButton` exposes:

- `Left`
- `Right`
- `Middle`

## Actions

Actions are logical names that group multiple keys.

| Method | What it does |
| --- | --- |
| `ClearAction(name)` | removes the entire binding |
| `AddActionBinding(name, key)` | adds a key |
| `RemoveActionBinding(name, key)` | removes a key |
| `IsActionDown(name)` | checks whether any bound key is held |
| `IsActionJustPressed(name)` | checks the press transition |
| `IsActionJustReleased(name)` | checks the release transition |

### Default bindings

On first use, the engine registers this automatically:

| Action | Keys |
| --- | --- |
| `accept` | `Space` |
| `cancel` | `Escape` |
| `jump` | `Space` |
| `interact` | `E` |
| `pause` | `Escape` |
| `debug_colliders` | `F3` |

:::tip
`IsAction...()` checks any key associated with the name.
If you want rebinding, clear the action and recreate it with your keys.
:::

## 1D axes

| Method | Use |
| --- | --- |
| `ClearAxis(name)` | removes the axis |
| `AddAxisBinding(name, negativeKey, positiveKey)` | adds a negative/positive pair |
| `RemoveAxisBinding(name, negativeKey, positiveKey)` | removes a pair |
| `GetAxis(name)` | returns a value in `[-1, 1]` |

`GetAxis()` sums every registered pair and then clamps the result.

## 2D axes

| Method | Use |
| --- | --- |
| `ClearAxis2D(name)` | removes the 2D axis |
| `AddAxis2DBinding(name, left, right, up, down)` | adds a 2D configuration |
| `RemoveAxis2DBinding(...)` | removes the configuration |
| `GetAxis2D(name)` | returns a normalized `Vec2` |

### Default axes

| Axis | Keys |
| --- | --- |
| `move` | arrows and `WASD` |
| `arrows_move` | arrows |
| `wasd_move` | `WASD` |

### Direction note

`GetAxis2D()` uses screen-space coordinates:

- `x > 0` goes right
- `y > 0` goes down

That matches the engine's logical resolution and the way the demo moves entities on screen.

## Mouse

`GetMousePosition()` returns the cursor position remapped to logical resolution.
`GetMouseDelta()` returns movement in window coordinates.

:::warning
Mouse delta and logical position do not use exactly the same space.
If you mix both in your own system, it is worth checking the context carefully.
:::

## Example

```cpp
const Vec2 move = Input::GetAxis2D("move");
if (Input::IsActionJustPressed("jump"))
{
    Log::Debug("jump");
}
```
