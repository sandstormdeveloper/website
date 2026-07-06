---
title: Getting Started
---

# Getting Started

PixelStorm is designed so a simple scene can be running with very little boilerplate. The core idea is straightforward:

1. Create an `Application`.
2. Load the textures and fonts your game will need.
3. Bind `UI` if you want to use the shortcut text helper.
4. Register one or more scenes.
5. Change to the initial scene.
6. Call `Run()`.

## Recommended Include

```cpp
#include "pixelstorm/PixelStorm.h"
```

The umbrella include is the easiest way to start because it exposes the most common public types:

- `Application`
- `Scene`
- `World`
- `Entity`
- `Input`
- `UI`
- the main components and helpers

If you prefer a more explicit build, you can include only the headers you need, but the umbrella include is the most convenient option while exploring the engine.

## Working Resolution

:::note
PixelStorm works in logical pixel units.
The initial window size defines the logical resolution used by the camera, mouse mapping, and text placement.
:::

This is one of the reasons the engine feels natural for pixel art: the gameplay code can work in simple screen-like coordinates instead of constantly converting between abstract world units and screen units.

## Minimal Project Shape

The repository is split into a few clear areas:

- `engine/` contains the reusable engine library.
- `demo/` shows a real game-style integration.
- `engine/assets/` contains the default shaders and base font.
- `demo/assets/` contains the sample textures used by the demo scenes.

## Asset Paths

Resources are loaded from runtime paths, so the working directory matters.
In the demo, a post-build step copies the asset folders next to the executable so the relative paths remain valid.

| Method | Expected path | Typical use |
| --- | --- | --- |
| `Application::LoadTexture` | any relative or absolute path you pass in | textures used by gameplay |
| `Application::LoadFont` | any runtime path you pass in | custom text styles |
| `Application::SetDefaultFont` | a font already loaded in the resource manager | switches the font used by `DrawText()` |

## What `Application` Initializes

When you construct an `Application`, the engine prepares the basic runtime for you:

- GLFW and GLAD
- the main window
- input bound to that window
- the time clock
- the 2D renderer
- the physics system
- the animation system
- the particle system
- the scene manager
- the base `PixelStormMini.ttf` font
- the default `default` and `crt` shaders
- the offscreen target used by the CRT-style postprocess

This is useful because it means gameplay code can focus on scenes and entities instead of manual engine bootstrapping.

## Very Small Startup Example

```cpp
#include "pixelstorm/PixelStorm.h"

class DemoScene final : public Scene
{
public:
    void OnEnter() override
    {
        GetWorld().CreateSprite(
            "Box",
            Vec2(160.0f, 180.0f),
            Vec2(32.0f, 32.0f),
            Colors::White(),
            "wall");
    }
};

int main()
{
    Application app(640, 360, "PixelStorm");

    app.LoadTexture("wall", "assets/wall.png");
    UI::Bind(app);

    app.GetScenes().AddScene<DemoScene>("demo");
    app.GetScenes().ChangeScene("demo");

    app.Run();

    UI::Unbind();
    return 0;
}
```

This example does not do much on its own, but it shows the important lifecycle pieces:

- the application owns the runtime
- scenes are registered by name
- `UI` is bound only while the application is active
- `Run()` blocks until the window closes

## Next Step

If you want to see a fully useful example with a scene, entity creation, input, and text, continue to the [Quick Start Guide](/docs/quick-start).
