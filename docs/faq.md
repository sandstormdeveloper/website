---
title: FAQ / Common Pitfalls
---

# FAQ / Common Pitfalls

## Nothing appears on screen

Check this first:

1. you called `app.Run()`
2. you registered a scene and activated it with `ChangeScene()`
3. the entity has `Transform` and `SpriteRenderer`
4. the texture exists or at least the path is correct
5. you did not hide the sprite with `Hide()` or `SetVisible(false)`

## Text does not appear

Usually it is one of two things:

- you did not call `UI::Bind(app)`
- no default font has been loaded

The engine now loads the default `PixelStormMini.ttf` font at size 16 automatically.
If you replace it, load another font with `Application::LoadFont()` and select it with `Application::SetDefaultFont()`.

## The collider does not rotate with the sprite

That is expected.

The public physics system uses AABB:

- the `Transform` rotation only affects drawing
- the collider remains axis-aligned
- the `Transform` scale does not change the collider either

## Changing scenes clears my world

That is also expected.

`SceneManager::ChangeScene()` clears the world before entering the new scene.
If you need persistence, keep it outside the world.

## `Entity` became invalid

An entity becomes invalid if:

- it never existed
- it was destroyed
- the registry no longer owns it

Use `IsValid()` before operating on it if the reference might expire.

## `Input::GetAxis2D("move")` returns zero

Check that:

- the window is initialized
- you are calling it inside an updated frame
- you did not clear the default bindings
- you are not querying a different action name that does not exist

## My sprite uses a strange texture

If `SpriteRenderer.TextureName` is empty, the engine uses the procedural fallback texture.
That helps debugging, but it also means forgetting to load a texture name still leaves something visible.

## Text follows the camera when I do not want it to

Use `followCamera = false` in `UI::Print()` or `Application::DrawText()`.

## The camera moves too slowly

`FollowCamera()` uses exponential smoothing when `followSpeed > 0`.

If you want instant follow, use `followSpeed = 0.0f`.

## `Play(name)` in animation does nothing

That method does not throw if the clip does not exist.

Check:

- that you added the clip with `AddClip()`
- that the name matches exactly
- that `Animator` and `SpriteRenderer` exist on the entity

## Particles are not spawning

Check:

- that the emitter has `Active = true`
- that you called `EmitBurst()`
- that `AutoEmit` and `EmitRate` are configured if you want continuous emission

## The screen uses strange coordinates

PixelStorm works with a fixed logical resolution defined by the initial window.
`GetMousePosition()` and the camera use that logical space, not the physical framebuffer.

:::tip
If something "works but does not show up", the problem is usually in the resource, the active scene, or the coordinate space.
:::
