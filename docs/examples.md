---
title: Examples
---

# Examples

These patterns come from the demo and from the real public API. They are meant to show the shape of normal gameplay code, not to replace the full reference pages.

## Create an Actor

```cpp
Entity player = GetWorld().CreateActor(
    "Player",
    Vec2(160.0f, 180.0f),
    Vec2(32.0f, 32.0f),
    Colors::White(),
    "player_run");
```

## Move an Entity

```cpp
const Vec2 move = Input::GetAxis2D("move");
player.Transform().Translate(move * 120.0f * deltaTime);
player.Rigidbody().SetVelocity(move * 120.0f);
```

## Change Scenes

```cpp
if (Input::IsActionJustPressed("interact"))
{
    ChangeScene("second");
}
```

## Follow an Entity With the Camera

```cpp
GetApplication().FollowCamera(player, Vec2(0.0f, 0.0f), false, 8.0f);
```

## Flip a Sprite

```cpp
player.Sprite().FlipX(player.Rigidbody().GetVelocity().x < 0.0f);
```

## Adjust the Rotation Pivot

```cpp
player.Transform().SetPivot(Vec2(16.0f, 16.0f));
player.Transform().Rotate(45.0f);
```

## Fixed HUD and World-Following Text

```cpp
UI::Print("Score: 120", Vec2(12.0f, 12.0f), Colors::White(), 1.0f, false);
UI::Print("Enemy", enemy.Transform().GetPosition(), Colors::Red(), 1.0f, true);
```

## Simple Trigger

```cpp
zone.Trigger().SetOnEnter([&](Entity other)
{
    if (other.GetId() == player.GetId())
    {
        Log::Debug("Player entered the zone");
    }
});
```

## Recommended Patterns

### An Actor That Responds to Input

1. create the entity with `CreateActor()`
2. read `Input::GetAxis2D("move")`
3. write velocity or translate
4. use `Animation().Play("walk")` when it moves

### Fixed HUD

1. call `UI::Print(..., false)`
2. use the default font
3. keep the text short and update it every frame

### Boss or NPC That Follows the Camera

1. create the visible entity
2. call `FollowCamera()`
3. enable `followRotation` if needed

### Trigger-Driven Scene Logic

1. create a trigger with `CreateStaticBox(..., true)`
2. register `SetOnEnter()` or `SetOnExit()`
3. keep the callback small and let the scene decide what to do next

:::tip
If you want to build a complete game quickly, use `CreateSprite()` for props, `CreateActor()` for movable bodies, and `CreateStaticBox()` for walls and triggers.
:::
