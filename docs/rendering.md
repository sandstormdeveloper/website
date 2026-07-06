---
title: Rendering
---

# Rendering

Rendering in PixelStorm is intentionally small and focused on 2D. The engine draws quads, text, and debug outlines; the gameplay side works with textures, fonts, and logical resource names; and the final image can optionally go through a CRT-style screen pass.

## Render Flow

At a high level, the frame is rendered in this order:

1. the active scene gets a chance to draw custom content
2. the world sprites are drawn
3. debug colliders are optionally outlined
4. queued text commands are rendered
5. the CRT-style postprocess is applied if it is enabled

This separation is useful because it keeps world rendering, debug visualization, and HUD text distinct while still presenting a single final frame.

## `Texture`

`Texture` represents an OpenGL texture or the procedural fallback texture used when a resource is missing.

| Method | Use |
| --- | --- |
| `Texture()` | creates the fallback texture |
| `Texture(path)` | loads a texture from disk |
| `Bind(slot)` | binds it to a texture unit |
| `GetWidth()` / `GetHeight()` | returns cached dimensions |

### Behavior

- if loading fails, the engine keeps running with the fallback texture
- the default filter is nearest-neighbor, which preserves the pixel-art look
- an empty `TextureName` on a sprite also resolves to the fallback texture

### Example

```cpp
Texture player("assets/player.png");
player.Bind(0);
```

## `Font`

`Font` bakes a TTF file into a texture atlas and stores glyph metrics for fast text rendering.

| Method | Use |
| --- | --- |
| `Font(path, pixelHeight)` | loads and bakes the font |
| `Load(path, pixelHeight)` | reloads the font |
| `Bind(slot)` | binds the atlas texture |
| `IsValid()` | checks whether loading succeeded |
| `GetPixelHeight()` | requested pixel height |
| `GetLineHeight()` | line spacing in the baked atlas |
| `GetAscent()` | baseline alignment offset |
| `FindGlyph(codepoint)` | looks up glyph metadata |

### Use Cases

| Case | Recommendation |
| --- | --- |
| HUD text, dialog, debug info | `Application::LoadFont()` + `Application::SetDefaultFont()` |
| isolated tools or experiments | create `Font` directly |

### Default Font

The application loads `PixelStormMini.ttf` automatically so text works out of the box. If you want a different font, load it through the application and switch the default font by name.

## `Shader`

`Shader` loads a shader program from `assets/shaders/`.

| Method | Use |
| --- | --- |
| `Shader(name)` | looks for `<name>.vert` and `<name>.frag` |
| `Use()` | activates the shader |
| `SetInt()` | sets an `int` uniform |
| `SetFloat()` | sets a `float` uniform |
| `SetMat4()` | sets a `mat4` uniform |
| `SetVec4()` | sets a `vec4` uniform |

### Expected Paths

```text
assets/shaders/default.vert
assets/shaders/default.frag
assets/shaders/crt.vert
assets/shaders/crt.frag
```

### Example

```cpp
Shader shader("default");
shader.Use();
shader.SetInt("u_Texture", 0);
```

## `Renderer`

`Renderer` is the low-level draw helper used by the engine internals. Gameplay code usually does not need to call it directly, but it is useful to understand what it actually does.

| Method | Use |
| --- | --- |
| `DrawQuad(shader, modelMatrix)` | draws a transformed quad |
| `DrawQuadOutline(shader, modelMatrix)` | draws an outline around a quad |
| `DrawText(shader, font, position, text, color, scale)` | draws text from a font atlas |

:::warning
`Renderer` assumes the shader and OpenGL state expected by the engine pipeline.
If you use it directly, you are responsible for respecting those expectations.
:::

## `ResourceManager`

`ResourceManager` stores loaded textures and fonts by logical name.

| Method | Use |
| --- | --- |
| `LoadTexture(name, path)` | loads and caches a texture |
| `LoadFont(name, path, pixelHeight)` | loads and caches a font |
| `HasTexture()` / `HasFont()` | checks whether a resource exists |
| `GetTexture()` / `GetFont()` | returns the stored resource or `nullptr` |
| `Clear()` | releases everything |

### Important Rule

If you load the same logical name twice, the second call succeeds and reuses the existing resource.
This keeps the gameplay code simple and avoids repeated loading.

## `AssetLoader`

`AssetLoader` is the direct file-loading helper used under the hood by `ResourceManager`.

| Method | Use |
| --- | --- |
| `LoadTexture(path)` | returns a `unique_ptr<Texture>` |
| `LoadFont(path, pixelHeight)` | returns a `unique_ptr<Font>` |

It is mostly useful as an implementation detail or as a starting point if you are building a higher-level loading layer.

## Sprite Rendering Details

Sprites are drawn from `Transform` and `SpriteRenderer` data. The renderer respects:

- `SpriteRenderer.TextureName`
- `SpriteRenderer.Color`
- `SpriteRenderer.Visible`
- `SpriteRenderer.RenderOrder`
- `SpriteRenderer.SourceRect`
- horizontal and vertical flipping

When a source rectangle is not set, the full texture is drawn.
When a texture cannot be resolved, the fallback texture is used instead of failing hard.

### Draw Order

The engine sorts visible sprites before drawing them:

1. lower `RenderOrder` values are drawn first
2. if the render order is the same, lower `Position.y` values are drawn first
3. if both values are equal, the entity ID is used as a final stable tie-breaker

This gives the 2D scene a predictable layering model and also helps emulate depth in top-down or side-view games.

## Postprocess

The engine includes a CRT-style screen pass through the `crt` shader. It is enabled by default, and you can toggle it from gameplay code:

```cpp
app.SetPostProcessEnabled(false);
```

The chromatic aberration inside the CRT shader scales down when the postprocess viewport is smaller, so the effect stays readable in reduced window sizes.

Use this when you want the final image without the screen-space effect, for example in a clean screenshot mode or a UI-heavy scene.

## Recommended Flow

The most convenient gameplay flow is:

1. use `Application::LoadTexture()` and `Application::LoadFont()` for extra assets
2. refer to them by logical name from your scenes and entities
3. draw through the engine-managed rendering pipeline
4. use `UI::Print()` or `Application::DrawText()` for text

:::tip
If a texture is missing, the engine usually keeps running with the fallback texture.
That makes missing-content debugging much easier during development.
:::
