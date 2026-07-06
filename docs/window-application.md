---
title: Window / Application
---

# Window / Application

This page covers the main runtime object and the window layer that supports it. In practice, gameplay code normally works through `Application`, while `Window` stays as the lower-level runtime wrapper around GLFW and the OpenGL context.

## `Application`

`Application` owns the engine runtime: window creation, resource loading, camera control, the active scene manager, and the update / render loop.

### Lifecycle

| Method | What it does |
| --- | --- |
| `Application(int width, int height, const char *title)` | initializes the runtime and creates the window |
| `~Application()` | releases the runtime and shuts everything down |
| `Run()` | executes the main loop until the window closes |
| `OnUpdate(const std::function<void(float)> &callback)` | registers a global per-frame callback |

### Recommended Use

In a normal game, most gameplay logic should live in scenes. `Application::OnUpdate()` is best reserved for small global tasks, tools, or special setup that genuinely does not belong to one scene.

### Main Frame Order

`Run()` follows a consistent order every frame:

1. updates `Time`
2. executes the `OnUpdate` callback, if one was registered
3. updates the active scene
4. flushes destroyed entities
5. checks global debug input such as collider toggling
6. updates physics
7. updates animation
8. updates particles
9. flushes destroyed entities again
10. renders the world and queued text
11. optionally applies the CRT-style postprocess
12. swaps buffers and polls events
13. captures the next input snapshot

That order matters because it keeps gameplay state, physics, and rendering aligned within the same frame.

### Resources

| Method | Use |
| --- | --- |
| `LoadTexture(name, path)` | registers a texture under a logical name |
| `LoadFont(name, path, pixelHeight)` | registers a font under a logical name |
| `SetDefaultFont(name)` | selects a loaded font for `DrawText()` |
| `SetPostProcessEnabled(enabled)` | enables or disables the CRT-style screen pass |
| `IsPostProcessEnabled()` | checks the current postprocess state |

### Behavior Details

| Method | Detail |
| --- | --- |
| `LoadTexture` | reuses the texture if the logical name already exists |
| `LoadFont` | reuses the font if the logical name already exists |
| `SetDefaultFont` | returns `false` if the font has not been loaded |
| `DrawText` | ignores empty strings and queues the command for later rendering |

### Text

`Application::DrawText()` does not draw immediately. It queues a text command that is rendered later in the frame, after the world has been drawn.

```cpp
app.DrawText("Loading...", Vec2(16.0f, 16.0f), Colors::White(), 1.0f, false);
```

| Parameter | Meaning |
| --- | --- |
| `position` | position in logical pixels |
| `color` | RGBA tint |
| `scale` | scale multiplier applied to the default font |
| `followCamera` | `true` for world text, `false` for fixed HUD text |

### Camera

| Method | What it does |
| --- | --- |
| `GetCamera()` | returns the main 2D camera |
| `SetCameraPosition()` | moves the camera in world space |
| `SetCameraRotation()` | rotates the camera around the Z axis |
| `SetCameraProjection()` | changes the orthographic bounds |
| `FollowCamera(entity, offset, followRotation, followSpeed)` | makes the camera follow an entity |
| `StopCameraFollow()` | clears the follow target |
| `IsCameraFollowing()` | checks whether a follow target is active |
| `IsPositionOutsideCamera(position, margin)` | checks whether a world position is outside the visible camera area |
| `ResetCameraTracking()` | restores the default camera state |

#### `FollowCamera`

| Parameter | Default | Notes |
| --- | --- | --- |
| `offset` | `(0, 0)` | offsets the camera relative to the target |
| `followRotation` | `false` | copies or ignores the target rotation |
| `followSpeed` | `8.0f` | values `<= 0` force an instant snap |

If the target entity becomes invalid or loses its `Transform`, the follow is canceled automatically.

`IsPositionOutsideCamera()` is useful for simple projectile cleanup, culling helper objects, and gameplay logic that should stop caring about things once they are offscreen.

### Physics and Debug

| Method | Use |
| --- | --- |
| `SetGravity()` | changes the global gravity vector |
| `GetGravity()` | reads the current gravity vector |
| `SetDebugDrawColliders()` | enables collider outlines |
| `IsDebugDrawCollidersEnabled()` | checks the current debug state |

:::note
Gravity affects bodies that have `Rigidbody::UseGravity = true`.
Static bodies and top-down actors that do not use gravity are not affected.
:::

### Scene and World Access

| Method | Returns |
| --- | --- |
| `GetWorld()` | the gameplay `World` |
| `GetScenes()` | the `SceneManager` |

`Application` is the most convenient entry point from gameplay code because it already exposes the services that scenes normally need.

## `Window`

`Window` is the lower-level runtime wrapper over GLFW and the OpenGL context.

| Method | What it does |
| --- | --- |
| `Window(width, height, title)` | creates the window and context |
| `Update()` | swaps buffers and polls events |
| `ShouldClose()` | reports whether the user requested the window to close |
| `GetNativeWindow()` | returns the underlying `GLFWwindow *` |
| `GetLogicalWidth()` / `GetLogicalHeight()` | logical rendering resolution |
| `GetFramebufferWidth()` / `GetFramebufferHeight()` | actual drawable size |

:::warning
Creating a `Window` directly is possible, but most gameplay code should let `Application` manage it.
If GLFW, GLAD, or window creation fails, the constructor throws.
:::

## `UI`

`UI` is a small static helper that forwards text commands to the active application.

| Method | Use |
| --- | --- |
| `UI::Bind(app)` | connects the helper to a running application |
| `UI::Unbind()` | clears the bound application |
| `UI::Print(...)` | queues text just like `Application::DrawText()` |

### When To Use It

- use `UI::Print()` inside scenes when you do not want to pass `Application &` around
- use `Application::DrawText()` if you already have direct access to the application

### Example

```cpp
UI::Print("Score: 10", Vec2(12.0f, 12.0f), Colors::White(), 1.0f, false);
```

:::tip
`followCamera = false` is the right choice for fixed HUD text.
Set it to `true` only if you want the text to move with the world.
:::
