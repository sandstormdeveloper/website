---
title: Text / UI
---

# Text / UI

PixelStorm gives you two paths for text:

- `Application::DrawText()`
- `UI::Print()`

## `Application::DrawText`

This is the base method.

| Parameter | Use |
| --- | --- |
| `text` | string to draw |
| `position` | position in logical pixels |
| `color` | RGBA tint |
| `scale` | text scale |
| `followCamera` | world text or fixed HUD |

### Rules

- empty strings are ignored
- text is queued and drawn later
- the current default font is used

### Example

```cpp
app.DrawText("Loading...", Vec2(16.0f, 16.0f), Colors::White(), 1.0f, false);
```

## `UI`

`UI` is just a static wrapper over the active application.

| Method | Use |
| --- | --- |
| `Bind(app)` | connects the application |
| `Unbind()` | breaks the connection |
| `Print(...)` | queues text |

### When to use it

- in scenes, so you do not have to pass `Application &` everywhere
- in gameplay code where you want a quick HUD access point

### Example

```cpp
UI::Print(
    "Press Interact to change scene",
    Vec2(16.0f, 16.0f),
    Colors::White(),
    1.0f,
    false);
```

## World text and fixed HUD

| Case | followCamera |
| --- | --- |
| HUD | `false` |
| NPC name label | `true` |
| contextual help | `false` |

### Mixed example

```cpp
UI::Print("Score: 120", Vec2(12.0f, 12.0f), Colors::White(), 1.0f, false);
UI::Print("Merchant", npc.Transform().GetPosition() + Vec2(0.0f, -24.0f), Colors::White(), 1.0f, true);
```

## Default font

The default font is usually set with:

```cpp
app.SetFont("PixelStormMini.ttf", 16.0f);
```

:::tip
If `UI::Print()` does not draw anything, first check that you called `UI::Bind(app)` and that a default font has been loaded.
:::
