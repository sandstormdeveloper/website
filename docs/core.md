---
title: Core
---

# Core

The core module groups the utility types and services that appear throughout the engine:

- public vector and color aliases
- convenience color helpers
- frame timing
- logging

## `PixelStorm.h`

`PixelStorm.h` is the recommended entry point when you want to use the public API from gameplay code.

```cpp
#include "pixelstorm/PixelStorm.h"
```

:::note
If you already know exactly which module you need, you can include the specific header instead of the umbrella include.
:::

## Math

`pixelstorm/core/Math.h` defines the most common aliases used across the engine:

| Type | Alias | Base |
| --- | --- | --- |
| 2D vector | `Vec2` | `glm::vec2` |
| 4D vector | `Vec4` | `glm::vec4` |
| RGBA color | `Color` | `Vec4` |
| 2D integer vector | `iVec2` | `glm::ivec2` |
| Dynamic array | `Array<T>` | `std::vector<T>` |

These aliases make gameplay code easier to read and reduce the amount of GLM-specific syntax you need to carry around in every file.

It also exposes a few math helpers so gameplay code can stay engine-style instead of falling back to `std::` everywhere:

| Function | Use |
| --- | --- |
| `Sin(radians)` | sine |
| `Cos(radians)` | cosine |
| `Tan(radians)` | tangent |
| `Atan2(y, x)` | angle from a vector |
| `Degrees(radians)` | converts radians to degrees |
| `Radians(degrees)` | converts degrees to radians |
| `Normalize(vec)` | returns a unit-length vector |
| `RandomFloat(min, max)` | returns a random float in range |
| `RandomInt(min, max)` | returns a random integer in range |
| `RandomChance(probability)` | returns true with the given probability |
| `SeedRandom(seed)` | seeds the shared random engine |

`Sin`, `Cos`, `Tan`, and `Atan2` use radians, which matches the standard C++ math functions.
Use `Degrees()` and `Radians()` when you need to bridge between radians and the engine's degree-based rotation values.
`Normalize()` returns a zero vector if the input has no length, so it is safe to use when the mouse is exactly over the source point.
The random helpers are designed to be easy to use from gameplay code without including `<random>`.

### Example

```cpp
SeedRandom(1234);

const float x = RandomFloat(-100.0f, 100.0f);
const int edge = RandomInt(0, 3);
const bool shouldSpawn = RandomChance(0.25f);
```

Use `RandomFloat()` when you need continuous values, `RandomInt()` for discrete choices, and `RandomChance()` when you only care about a yes or no result.

It also includes a small `ToString()` helper for common engine types:

| Function | Result |
| --- | --- |
| `ToString(Vec2)` | `"(x, y)"` |
| `ToString(Vec4)` | `"(x, y, z, w)"` |
| `ToString(iVec2)` | `"(x, y)"` |
| `ToString(double)` | `"1.2"` style one-decimal formatting |

This is handy when you want to build debug messages or HUD text without writing formatting code every time.

The same header also provides two small collection helpers:

| Function | Use |
| --- | --- |
| `Add(array, value)` | adds an element to the end |
| `ForEach(array, func)` | runs a function on every element |
| `RemoveIf(array, predicate)` | removes elements that match a condition |

These helpers are meant to keep gameplay code readable when you only need to iterate or clean up a list.

### Example

```cpp
Add(bullets, Bullet{ bullet, bulletDirection * 360.0f, false });

ForEach(bullets, [&](Bullet &bullet)
{
    bullet.EntityHandle.Transform().Translate(bullet.Velocity * deltaTime);
});

RemoveIf(bullets, [](const Bullet &bullet)
{
    return bullet.Dead;
});
```

This pattern is usually the easiest one for gameplay code:
- `Add()` appends a new element
- `ForEach()` updates the elements
- `RemoveIf()` removes the ones that are no longer needed

`Math.h` also exposes a few small helpers that are handy in gameplay code but easy to overlook:

| Function | Use |
| --- | --- |
| `EraseIf(array, predicate)` | removes matching elements in place |
| `ToInt(value)` | converts numeric values to `int` |
| `Abs(value)` | absolute value for `float`, `double`, and `int` |

`EraseIf()` is the lower-level implementation used by `RemoveIf()`.
`ToInt()` is useful when you need to convert measured values or counters to an integer HUD label.
`Abs()` keeps gameplay code from depending on overload resolution in `std::abs()` when you only need a quick numeric absolute value.

## Colors

`pixelstorm/core/Color.h` exposes a small set of convenience colors:

| Function | Value |
| --- | --- |
| `Colors::White()` | opaque white |
| `Colors::Red()` | soft red used by the demo |
| `Colors::Blue()` | soft blue used by the demo |
| `Colors::Green()` | soft green |

They are intended as simple helpers, not as a full palette system.

### Example

```cpp
entity.Sprite().SetColor(Colors::Green());
```

## Time

`Time` tracks frame delta time and elapsed time.

| Function | What it does |
| --- | --- |
| `Time::Init()` | starts the clock |
| `Time::Update()` | recalculates delta time and elapsed time |
| `Time::Shutdown()` | resets the state |
| `Time::GetDeltaTime()` | time since the previous frame |
| `Time::GetElapsedTime()` | total time since the clock started |

### Why It Matters

Game logic should normally be frame-rate independent. PixelStorm uses `deltaTime` so movement, physics, animation, and particles advance proportionally to real time instead of to the raw number of rendered frames.

### Example

```cpp
const float dt = static_cast<float>(Time::GetDeltaTime());
entity.Transform().Translate(Vec2(60.0f * dt, 0.0f));
```

:::tip
`GetDeltaTime()` returns `double`, so it is normal to cast it to `float` in gameplay code.
:::

## Log

`Log` writes messages to the console.
`Log::Debug()` is the only public logging entry point for gameplay code.

| Function | Use |
| --- | --- |
| `Log::Debug()` | gameplay events or technical diagnostics |

### Notes

- use `Debug` for scene events, triggers, or temporary diagnostics
- the `Info`, `Warning`, and `Error` helpers exist for engine-internal use
- gameplay code should not call the private severity helpers directly

:::important
`Init()` and `Shutdown()` are managed by `Application`.
Gameplay code should not call them directly.
:::
