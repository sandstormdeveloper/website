---
title: Text / UI
---

# Text / UI

PixelStorm gives you two paths for drawing text:

- `Application::DrawText()`
- `UI::Print()`

Both routes end up in the same text queue. The difference is mostly convenience.

## Anchors

Text drawing now supports anchors so you can center a label without manually adjusting its position.

| Anchor | Effect |
| --- | --- |
| `TextAnchor::TopLeft` | default, no offset |
| `TextAnchor::TopCenter` | centers horizontally |
| `TextAnchor::TopRight` | aligns the top-right corner |
| `TextAnchor::MiddleLeft` | centers vertically |
| `TextAnchor::MiddleCenter` | centers horizontally and vertically |
| `TextAnchor::MiddleRight` | aligns the middle-right edge |
| `TextAnchor::BottomLeft` | aligns the bottom-left corner |
| `TextAnchor::BottomCenter` | centers horizontally and aligns the bottom |
| `TextAnchor::BottomRight` | aligns the bottom-right corner |

## `Application::DrawText`

This is the base method.

| Parameter | Use |
| --- | --- |
| `text` | string to draw |
| `position` | position in logical pixels |
| `color` | RGBA tint |
| `scale` | text scale |
| `followCamera` | world text or fixed HUD |
| `anchor` | alignment relative to `position` |

### Rules

- empty strings are ignored
- text is queued and drawn later
- the current default font is used

### Example

```cpp
app.DrawText("Loading...", Vec2(320.0f, 180.0f), Colors::White(), 1.0f, false, TextAnchor::MiddleCenter);
```

## `UI`

`UI` is a static wrapper over the active application.

| Method | Use |
| --- | --- |
| `Bind(app)` | connects the application |
| `Unbind()` | breaks the connection |
| `Print(...)` | queues text |

### When To Use It

- in scenes, so you do not have to pass `Application &` everywhere
- in gameplay code where you want a quick HUD access point

### Example

```cpp
UI::Print(
    "Press Interact to change scene",
    Vec2(320.0f, 180.0f),
    Colors::White(),
    1.0f,
    false,
    TextAnchor::MiddleCenter);
```

## World Text and Fixed HUD

| Case | followCamera |
| --- | --- |
| HUD | `false` |
| NPC name label | `true` |
| contextual help | `false` |

### Mixed Example

```cpp
UI::Print("Score: 120", Vec2(12.0f, 12.0f), Colors::White(), 1.0f, false);
UI::Print("Merchant", npc.Transform().GetPosition() + Vec2(0.0f, -24.0f), Colors::White(), 1.0f, true);
```

`ToString()` from `pixelstorm/core/Math.h` is useful here when you want to show values like positions or coordinates:

```cpp
UI::Print("Pos: " + ToString(player.Transform().GetPosition()), Vec2(12.0f, 28.0f), Colors::White(), 1.0f, false);
```

## Practical Notes

- `UI::Print()` does nothing if `UI::Bind(app)` was not called
- the default `PixelStormMini.ttf` font is loaded automatically by `Application`
- if you replace the default font, remember to set it as the new default before drawing text

:::tip
If `UI::Print()` does not draw anything, first check that `UI::Bind(app)` was called and that a default font is available.
:::
