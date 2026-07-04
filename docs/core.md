---
title: Core
---

# Core

This module groups the basic utilities that show up in almost every game:

- public vector and color types
- convenience colors
- frame timing
- logging

## `PixelStorm.h`

`PixelStorm.h` is the recommended entry include when you want to use the public API from gameplay code.

```cpp
#include "pixelstorm/PixelStorm.h"
```

:::note
If you already know exactly which module you need, you can include the specific header instead of the umbrella include.
:::

## Math

`pixelstorm/core/Math.h` defines simple aliases for the most used types:

| Type | Alias | Base |
| --- | --- | --- |
| 2D vector | `Vec2` | `glm::vec2` |
| RGBA color | `Color` | `glm::vec4` |

Use them when you want more readable gameplay code and do not want to depend on GLM types in every file.

## Colors

`pixelstorm/core/Color.h` exposes convenience colors:

| Function | Value |
| --- | --- |
| `Colors::White()` | opaque white |
| `Colors::Red()` | soft red used by the demo |
| `Colors::Blue()` | soft blue used by the demo |
| `Colors::Green()` | soft green |

These are convenience helpers, not a full palette.

## Time

`Time` tracks frame delta time and total elapsed time.

| Function | What it does |
| --- | --- |
| `Time::Init()` | starts the clock |
| `Time::Update()` | recalculates delta time and elapsed time |
| `Time::Shutdown()` | resets the state |
| `Time::GetDeltaTime()` | time since the previous frame |
| `Time::GetElapsedTime()` | total time since the clock started |

### Usage

```cpp
const float dt = static_cast<float>(Time::GetDeltaTime());
entity.Transform().Translate(Vec2(60.0f * dt, 0.0f));
```

:::tip
`GetDeltaTime()` returns `double`, so it is normal to cast it to `float` in gameplay code.
:::

## Log

`Log` writes messages to the console.

| Function | Use |
| --- | --- |
| `Log::Debug()` | gameplay or diagnostic messages |
| `Log::Info()` | general information |
| `Log::Warning()` | non-fatal warnings |
| `Log::Error()` | important errors |

### When to use it

- use `Debug` for gameplay events
- use `Warning` for recoverable conditions
- use `Error` when an operation cannot continue

:::important
`Init()` and `Shutdown()` are managed by `Application`. You should not call them from gameplay code.
:::
