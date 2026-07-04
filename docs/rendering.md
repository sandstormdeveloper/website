---
title: Rendering
---

# Rendering

This module covers textures, fonts, shaders, and the 2D render pipeline used by PixelStorm.

## `Texture`

`Texture` represents an OpenGL texture or the fallback texture.

| Method | Use |
| --- | --- |
| `Texture()` | creates the procedural fallback texture |
| `Texture(path)` | loads a texture from disk |
| `Bind(slot)` | binds it to a texture unit |
| `GetWidth()` / `GetHeight()` | cached dimensions |

### Behavior

- if loading fails, the engine uses a 2x2 fallback texture
- the default filter is nearest-neighbor to preserve pixel-art look

### Example

```cpp
Texture player("assets/player.png");
player.Bind(0);
```

## `Font`

`Font` converts a TTF font into a texture atlas for fast text rendering.

| Method | Use |
| --- | --- |
| `Font(path, pixelHeight)` | loads and bakes the font |
| `Load(path, pixelHeight)` | reloads the font |
| `Bind(slot)` | binds the atlas texture |
| `IsValid()` | checks whether loading succeeded |
| `GetPixelHeight()` | requested pixel height |
| `GetLineHeight()` | real line height |
| `GetAscent()` | ascent used for baseline alignment |
| `FindGlyph(codepoint)` | looks up glyph metadata |

### Use cases

| Case | Recommendation |
| --- | --- |
| HUD and dialog | `Application::SetFont()` |
| tooling or isolated tests | `Font` directly |

## `Shader`

`Shader` loads a shader program from `assets/shaders/`.

| Method | Use |
| --- | --- |
| `Shader(name)` | looks for `<name>.vert` and `<name>.frag` |
| `Use()` | activates the shader |
| `SetInt()` | `int` uniform |
| `SetMat4()` | `mat4` uniform |
| `SetVec4()` | `vec4` uniform |

### Expected path

```text
assets/shaders/default.vert
assets/shaders/default.frag
```

### Example

```cpp
Shader shader("default");
shader.Use();
shader.SetInt("u_Texture", 0);
```

## `Renderer`

`Renderer` draws quads and text using the engine pipeline.

| Method | Use |
| --- | --- |
| `DrawQuad(shader, modelMatrix)` | draws a quad with a transform |
| `DrawQuadOutline(shader, modelMatrix)` | draws the outline |
| `DrawText(shader, font, position, text, color, scale)` | draws text |

:::warning
`Renderer` is meant for the engine layer. If you use it directly, you must respect the shader and state expected by the pipeline.
:::

## `ResourceManager`

`ResourceManager` keeps loaded resources by logical name.

| Method | Use |
| --- | --- |
| `LoadTexture(name, path)` | loads and caches a texture |
| `LoadFont(name, path, pixelHeight)` | loads and caches a font |
| `HasTexture()` / `HasFont()` | checks whether a resource exists |
| `GetTexture()` / `GetFont()` | gets the resource |
| `Clear()` | releases everything |

### Important rule

If you load the same name twice, the second call succeeds and reuses the existing resource.

## `AssetLoader`

`AssetLoader` is a direct loading helper.

| Method | Use |
| --- | --- |
| `LoadTexture(path)` | returns `unique_ptr<Texture>` |
| `LoadFont(path, pixelHeight)` | returns `unique_ptr<Font>` |

It is useful for tools or for your own higher-level layer.

## Recommended flow

The most convenient gameplay flow is:

1. use `Application::LoadTexture()` and `Application::SetFont()`
2. let `ResourceManager` cache the resources
3. draw through `SpriteRenderer` and `UI::Print()`

:::tip
If a texture does not exist, the engine usually keeps running with the fallback texture, which makes missing-content debugging much easier.
:::
