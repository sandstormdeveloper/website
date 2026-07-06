---
title: Quick Start Guide
---

# Quick Start Guide

The fastest way to see PixelStorm in action is to create a small scene that spawns one sprite, moves it with input, and draws a bit of UI text.

## Complete Minimal Example

```cpp
#include "pixelstorm/PixelStorm.h"

class DemoScene final : public Scene
{
public:
    void OnEnter() override
    {
        m_Box = GetWorld().CreateSprite(
            "Box",
            Vec2(160.0f, 180.0f),
            Vec2(32.0f, 32.0f),
            Colors::White(),
            "wall");
    }

    void OnUpdate(float deltaTime) override
    {
        const Vec2 movement = Input::GetAxis2D("move");
        m_Box.Transform().Translate(movement * 120.0f * deltaTime);

        if (movement.x < 0.0f)
        {
            m_Box.Sprite().FlipX(true);
        }
        else if (movement.x > 0.0f)
        {
            m_Box.Sprite().FlipX(false);
        }

        UI::Print(
            "Move with WASD or the arrow keys",
            Vec2(16.0f, 16.0f),
            Colors::White(),
            1.0f,
            false);
    }

private:
    Entity m_Box;
};

int main()
{
    Application app(640, 360, "PixelStorm Quick Start");

    app.LoadTexture("wall", "assets/wall.png");
    UI::Bind(app);

    app.GetScenes().AddScene<DemoScene>("demo");
    app.GetScenes().ChangeScene("demo");

    app.Run();

    UI::Unbind();
    return 0;
}
```

## What This Example Shows

- A logical `640x360` window, which is a very common pixel-art friendly ratio.
- A texture loaded under the logical name `wall`.
- A scene that owns its own gameplay state.
- A visible entity created through the `World` helper.
- Movement driven by the built-in `move` axis.
- A HUD line drawn through `UI::Print()`.

## What Is Happening Behind The Scenes

When this code runs, the engine automatically handles a few things that are easy to miss on a first read:

- the default font is already loaded by `Application`
- the main camera is set up from the initial window size
- the input layer is already connected to the GLFW window
- the frame loop updates time, physics, animation, particles, and rendering in order

That is why the example can stay so small while still behaving like a real game scene.

## Default Input

You do not need to bind movement keys for this first example.
The engine already registers a default `move` axis that accepts both `WASD` and the arrow keys.

## Useful Next Steps

- Replace `wall.png` with your own sprite.
- Swap `CreateSprite()` for `CreateActor()` if the entity needs physics.
- Add `ChangeScene()` calls if you want menu and gameplay states.
- Use `FollowCamera()` if the scene should keep the player centered.

:::tip
If the sprite does not show up, check the asset path first.
Most first-run issues are caused by the working directory rather than by the code itself.
:::
