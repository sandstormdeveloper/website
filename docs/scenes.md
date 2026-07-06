---
title: Scenes
---

# Scenes

Scenes are the main gameplay flow unit in PixelStorm. They let the engine separate menu states, game states, and transition states without forcing everything into a single update function.

## `Scene`

A scene inherits from `Scene` and overrides the lifecycle callbacks.

| Method | When it is called |
| --- | --- |
| `OnEnter()` | when the scene becomes active |
| `OnUpdate(deltaTime)` | every frame during gameplay logic |
| `OnRender()` | before the engine presents the frame |
| `OnExit()` | just before the scene stops being active |

### Available Context

Inside a scene you can access:

- `GetWorld()`
- `GetScenes()`
- `GetPhysicsSystem()`
- `GetApplication()`
- `ChangeScene(name)`

:::important
The context is bound by `SceneManager`.
Do not assume the accessors are valid before the scene has been registered and activated.
:::

### Recommended Structure

```cpp
class GameScene final : public Scene
{
public:
    void OnEnter() override;
    void OnUpdate(float deltaTime) override;
    void OnExit() override;
};
```

## `SceneManager`

`SceneManager` registers scenes by name and controls which one is active.

### Public API

| Method | Use |
| --- | --- |
| `AddScene<TScene>(name, ...)` | constructs and registers a scene internally |
| `AddScene(name, unique_ptr)` | registers an already created scene |
| `HasScene(name)` | checks whether it exists |
| `ChangeScene(name)` | changes the active scene |
| `Update(deltaTime)` | updates the active scene |
| `Render()` | calls `OnRender()` on the active scene |
| `GetActiveScene()` | returns the current scene |
| `GetActiveSceneName()` | returns the current scene name |

### Rules

| Situation | Result |
| --- | --- |
| empty name in `AddScene()` | returns `false` |
| null `unique_ptr` in `AddScene()` | returns `false` |
| duplicate name | returns `false` |
| `ChangeScene()` with an unknown name | returns `false` |
| `ChangeScene()` without a bound world | returns `false` |

### What `ChangeScene()` Does

When you change scenes:

1. it calls `OnExit()` on the current scene, if any
2. it resets camera tracking
3. it clears the world
4. it activates the new scene
5. it binds the current context
6. it calls `OnEnter()` on the new scene

:::warning
Changing scenes clears the entire world.
If you need persistence between scenes, keep it outside the world or rebuild it on entry.
:::

### Example

```cpp
app.GetScenes().AddScene<GameScene>("game");
app.GetScenes().AddScene<MenuScene>("menu");
app.GetScenes().ChangeScene("menu");
```

If you already have a `std::unique_ptr<Scene>`, you can still pass it directly. For the common case, the template form avoids writing `GameScene{}` at the call site.

## Useful Patterns

### Change Scene From Gameplay

```cpp
if (Input::IsActionJustPressed("interact"))
{
    ChangeScene("second");
}
```

### Access Physics From a Scene

```cpp
const std::vector<TriggerEvent> events = GetPhysicsSystem().GetTriggerEventsFor(player);
```

### Custom Rendering

`OnRender()` is useful for extra drawing, overlays, or custom debug visuals. The engine still draws the main world afterward.

For centered text in menus or overlays, `UI::Print()` and `Application::DrawText()` accept a `TextAnchor` such as `TextAnchor::MiddleCenter`.

:::tip
If you only need normal gameplay, `OnUpdate()` is usually enough.
Use `OnRender()` when you want to complement the automatic engine drawing.
:::
