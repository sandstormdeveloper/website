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
| RGBA color | `Color` | `glm::vec4` |

These aliases make gameplay code easier to read and reduce the amount of GLM-specific syntax you need to carry around in every file.

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

`Log` writes messages to the console and is used by both the engine and gameplay code.

| Function | Use |
| --- | --- |
| `Log::Debug()` | gameplay events or technical diagnostics |
| `Log::Info()` | general information |
| `Log::Warning()` | non-fatal problems |
| `Log::Error()` | important failures |

### When To Use Each Level

- use `Debug` for scene events, triggers, or temporary diagnostics
- use `Info` for initialization and normal state changes
- use `Warning` when something is recoverable but suspicious
- use `Error` when the operation cannot continue safely

:::important
`Init()` and `Shutdown()` are managed by `Application`.
Gameplay code should not call them directly.
:::
