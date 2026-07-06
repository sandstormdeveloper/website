---
title: Animation
---

# Animation

The engine animation system is based on spritesheet clips and one animator per entity. It is intentionally simple, but it covers the common cases needed by a small 2D game: idle states, walking loops, one-shot effects, and basic clip switching.

## `AnimationClip`

`AnimationClip` describes how to read frames from a spritesheet.

| Field | Default | Use |
| --- | --- | --- |
| `FrameSize` | `(0, 0)` | size of each frame |
| `FrameCount` | `0` | total number of frames |
| `FramesPerRow` | `0` | horizontal layout |
| `FPS` | `12.0f` | playback speed |
| `Loop` | `true` | whether it loops |
| `StartFrame` | `0` | base frame inside the spritesheet |

### Behavior

- if `FramesPerRow` is `0`, the system uses `1`
- if `FrameCount <= 0`, the clip does not advance
- if `FPS <= 0`, the clip stays on the current frame

### Example

```cpp
AnimationClip run(iVec2(32, 32), 6, 3, 10.0f, true, 0);
```

## `Animator`

`Animator` stores the playback state.

| Field | Default | Use |
| --- | --- | --- |
| `Clips` | empty | clip map by name |
| `CurrentClip` | empty | active clip |
| `Playing` | `true` | whether it advances |
| `CurrentFrame` | `0` | current frame |
| `Accumulator` | `0.0f` | time accumulated toward the next frame |

## `AnimationProxy`

`Entity::Animation()` returns a proxy for managing the animator.

| Method | Use |
| --- | --- |
| `AddClip(name, clip)` | registers or replaces a clip |
| `HasClip(name)` | checks existence |
| `RemoveClip(name)` | removes a clip |
| `Play(name)` | plays a clip from the start |
| `Play()` | resumes the current clip |
| `Pause()` | freezes the current frame |
| `Stop()` | stops and rewinds |
| `Restart()` | restarts the active clip |
| `IsPlaying()` | checks playback state |
| `GetCurrentClip()` | active clip name |
| `GetFrame()` / `SetFrame()` | current frame |
| `GetFPS()` / `SetFPS()` | speed |
| `IsLooping()` / `SetLoop()` | looping |
| `GetFrameSize()` / `SetFrameSize()` | frame size |
| `GetFrameCount()` / `SetFrameCount()` | number of frames |
| `GetFramesPerRow()` / `SetFramesPerRow()` | sheet layout |

### Key Behavior

- `Play(name)` does nothing if the clip does not exist
- `RemoveClip(name)` clears the active clip if it was removed
- `SetFrame()` resets the time accumulator

### Example

```cpp
player.Animation().AddClip("idle", AnimationClip(iVec2(32, 32), 4, 4, 0.0f, true));
player.Animation().AddClip("walk", AnimationClip(iVec2(32, 32), 6, 3, 10.0f, true));
player.Animation().Play("walk");
```

## System Integration

`AnimationSystem` automatically updates entities that have:

- `Animator`
- `SpriteRenderer`

When the frame advances, it writes the sprite `SourceRect`.

:::important
Public animation does not move the entity.
It only changes the sprite frame selection.
Use `Transform` or `Rigidbody` to move an actor.
:::
