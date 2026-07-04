---
title: Getting Started
---

# Getting Started

PixelStorm is designed so a game scene can be up and running with very little code:

1. Create an `Application`.
2. Load resources.
3. Register one or more scenes.
4. Switch to the initial scene.
5. Call `Run()`.

:::note
The API is built around logical pixel units. The engine keeps the initial window aspect ratio and uses that resolution as the basis for input, camera, and text.
:::

## Recommended include

```cpp
#include "pixelstorm/PixelStorm.h"
```

That include brings in the most important public surface:

- `Application`
- `Scene`
- `World`
- `Entity`
- `Input`
- `UI`
- the main components and helpers

## Minimal structure

The demo follows this structure:

- `engine/` contains the engine library.
- `demo/` shows how to link it into a real game.
- `engine/assets/` contains shaders and the base font.
- `demo/assets/` contains the sample textures.

## Minimal CMake

If you want to integrate the engine into another project, the basic idea is the same one used by the demo:

```cmake
add_executable(my_game
    src/main.cpp
    src/MyScene.cpp
)

target_link_libraries(my_game PRIVATE pixelstorm_engine)
target_include_directories(my_game PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/include)
```

:::important
Assets are resolved at runtime through relative paths from the working directory.
In the demo, `post_build` copies `engine/assets` and `demo/assets` next to the executable.
:::

## Asset paths

There are two common ways to load content:

| Method | Expected path | Recommended use |
| --- | --- | --- |
| `Application::LoadTexture` | any relative or absolute path you pass in | standalone resources from any folder |
| `Application::SetFont` | `assets/fonts/<name>` | main game font |
| `Application::SetDefaultShader` | `assets/shaders/<name>.vert` and `.frag` | engine base shader |

## What `Application` initializes

When you create the application, the engine prepares:

- GLFW and GLAD
- the main window
- input bound to the window
- the time clock
- the 2D renderer
- the physics system
- the animation system
- the particle system
- the scene manager
- the base `PixelStormMini.ttf` font
- the base `default` shader

:::tip
If you want to see how everything fits together quickly, continue to the [Quick Start Guide](/docs/quick-start).
:::
