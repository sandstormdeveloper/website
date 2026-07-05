---
title: Window / Application
---

# Window / Application

This module covers the entry point of any PixelStorm game.

## `Application`

`Application` creates and manages the engine runtime: window, renderer, camera, systems, resources, and scenes.

### Lifecycle

| Method | What it does |
| --- | --- |
| `Application(int width, int height, const char *title)` | initializes the engine and creates the window |
| `~Application()` | releases resources and shuts down the runtime |
| `Run()` | runs the main loop |
| `OnUpdate(const std::function<void(float)> &callback)` | registers a global per-frame callback |

### Actual loop order

`Run()` follows this order every frame:

1. updates `Time`
2. runs the `OnUpdate` callback, if present
3. updates the active scene
4. flushes destroyed entities
5. processes physics
6. processes animation
7. processes particles
8. flushes destroyed entities again
9. draws world and text
10. updates window and input

:::important
If you use scenes, most gameplay should live in `Scene::OnEnter`, `OnUpdate`, `OnRender`, and `OnExit`.
Reserve `Application::OnUpdate` for very simple global logic or tools.
:::

### Resources

| Method | Use |
| --- | --- |
| `LoadTexture(name, path)` | registers a texture under a logical name |
| `LoadFont(name, path, pixelHeight)` | registers a font under a logical name |
| `SetDefaultFont(name)` | sets an already loaded font as the default font |
| `SetPostProcessEnabled(enabled)` | enables or disables the CRT-style postprocess |
| `IsPostProcessEnabled()` | checks the current postprocess state |

### Behavior details

| Method | Default / detail |
| --- | --- |
| `LoadTexture` | reuses the resource if that name already exists |
| `LoadFont` | reuses the resource if that name already exists |
| `SetDefaultFont` | fails if the font is not loaded |
| `SetPostProcessEnabled` | toggles the final screen pass without changing the loaded shader |
| `IsPostProcessEnabled` | returns the current toggle state |
| `DrawText` | ignores empty strings |

### Text

`DrawText()` queues text for the current frame.

```cpp
app.DrawText("Hello", Vec2(16.0f, 16.0f), Colors::White(), 1.0f, false);
```

| Parameter | Meaning |
| --- | --- |
| `position` | position in logical pixels |
| `color` | RGBA tint |
| `scale` | text scale multiplier |
| `followCamera` | `true` for world text, `false` for fixed HUD |

### Camera

| Method | What it does |
| --- | --- |
| `GetCamera()` | returns the main 2D camera |
| `SetCameraPosition()` | moves the camera |
| `SetCameraRotation()` | rotates the camera |
| `SetCameraProjection()` | changes the orthographic bounds |
| `FollowCamera(entity, offset, followRotation, followSpeed)` | makes the camera follow an entity |
| `StopCameraFollow()` | clears the follow target |
| `IsCameraFollowing()` | checks whether follow is active |

#### `FollowCamera`

| Parameter | Default | Note |
| --- | --- | --- |
| `offset` | `(0, 0)` | offsets the camera from the target |
| `followRotation` | `false` | copies or ignores the target rotation |
| `followSpeed` | `8.0f` | `<= 0` forces instant follow |

If the entity becomes invalid or loses `Transform`, follow is canceled automatically.

### Physics and debug

| Method | Use |
| --- | --- |
| `SetGravity()` | changes global gravity |
| `GetGravity()` | reads global gravity |
| `SetDebugDrawColliders()` | enables collider debug drawing |
| `IsDebugDrawCollidersEnabled()` | checks the current state |

:::note
The gravity affects `Rigidbody` instances that have `UseGravity = true`.
:::

### Access to scene and world

| Method | Returns |
| --- | --- |
| `GetWorld()` | public gameplay `World` |
| `GetScenes()` | `SceneManager` |

`Application` is the recommended way to work from gameplay code.

By default, the engine loads the base shader and font, and the CRT-style postprocess is enabled.
If you want a clean output, call `Application::SetPostProcessEnabled(false)`.

## `Window`

`Window` is the runtime layer over GLFW and the OpenGL window.

| Method | What it does |
| --- | --- |
| `Window(width, height, title)` | creates the window and context |
| `Update()` | swaps buffers and polls events |
| `ShouldClose()` | reports whether the window should close |
| `GetNativeWindow()` | returns the `GLFWwindow *` |
| `GetLogicalWidth()` / `GetLogicalHeight()` | logical resolution used by the engine |

:::warning
Creating a `Window` directly is possible, but you should usually let `Application` manage it.
If GLFW, GLAD, or window creation fails, the constructor throws.
:::

## `UI`

`UI` is a static helper for quick text output.

| Method | Use |
| --- | --- |
| `UI::Bind(app)` | connects the helper to a running application |
| `UI::Unbind()` | clears the active reference |
| `UI::Print(...)` | queues text just like `Application::DrawText()` |

### When to use it

- use `UI::Print()` if you want text from scenes without passing the application around
- use `Application::DrawText()` if you already have direct access to the instance

### Example

```cpp
UI::Print("Score: 10", Vec2(12.0f, 12.0f), Colors::White(), 1.0f, false);
```

:::tip
`followCamera = false` is the correct choice for fixed HUD text.
Set it to `true` only if you want text that moves with the world.
:::
