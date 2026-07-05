---
title: Quick Start Guide
---

# Quick Start Guide

The shortest way to get a functional window is this:

1. Create the application.
2. Load a texture and the base font.
3. Bind `UI` if you want to use `UI::Print()`.
4. Register a scene.
5. Create a visible entity.
6. Move it with input.
7. Draw text on screen.

```cpp
#include "pixelstorm/PixelStorm.h"

#include <memory>

class DemoScene final : public Scene
{
public:
    void OnEnter() override
    {
        m_Box = GetWorld().CreateSprite(
            "Box",
            Vec2(-80.0f, 0.0f),
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
            "Move with WASD or arrows",
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

    app.GetScenes().AddScene("demo", std::make_unique<DemoScene>());
    app.GetScenes().ChangeScene("demo");

    app.Run();

    UI::Unbind();
    return 0;
}
```

## What this example does

- Opens a `640x360` window.
- Loads a texture named `wall`.
- Uses the default text font loaded by the engine.
- Registers a scene.
- Creates a visible entity with `CreateSprite()`.
- Moves it with the default `move` axis.
- Draws a fixed HUD line with `UI::Print()`.

:::tip
The `move` axis is already bound by default to both `WASD` and the arrow keys.
You do not need manual bindings for this first example.
:::
