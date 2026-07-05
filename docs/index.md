---
title: PixelStorm API Docs
sidebar_position: 0
---

# PixelStorm API Docs

PixelStorm is a compact 2D engine written in C++ and built around OpenGL. It was designed for pixel-art style games, so the public API focuses on clear gameplay concepts: scenes, entities, resources, input, camera control, 2D rendering, physics, animation, particles, and text.

This documentation explains the public surface of the engine as it is meant to be used from gameplay code. It also adds enough context to help a new user understand why the API is structured the way it is, how the main systems fit together, and which parts of the engine are infrastructure rather than game logic.

## What You Will Find

- A practical getting-started path for bringing up a working window quickly.
- A module-by-module reference for the public API.
- Notes about default behavior, limits, and conventions that matter in real projects.
- Examples based on the engine and demo code, so the usage patterns stay close to reality.

:::important
These pages document only the public API used from gameplay code.
If a symbol is not exposed in the public headers, or it does not appear in real usage inside the repository, it is intentionally left out.
:::

## Recommended Path

1. Start with [Getting Started](/docs/getting-started) to understand the minimum setup.
2. Read [Quick Start Guide](/docs/quick-start) for a complete working example.
3. Use the module pages when you need details about a specific system.
4. Check [FAQ / Common Pitfalls](/docs/faq) when something behaves differently from what you expected.

## Project Structure

| Area | What it covers |
| --- | --- |
| Core | `Application`, `Time`, `Log`, `Color`, `Math`, `Window` |
| ECS | `Entity`, `World`, `Registry`, and the component proxies |
| Rendering | textures, fonts, shaders, 2D draw calls, postprocess |
| Scene flow | scene registration, scene switching, active scene context |
| Gameplay systems | input, physics, animation, particles, UI text |

## Design Notes

- The engine keeps gameplay code close to a small number of high-level concepts.
- Public helpers prefer logical names over low-level engine details, especially for resources and scenes.
- The logical resolution is defined by the initial `Application` window size, which keeps coordinates predictable for pixel art.
- The default runtime already includes a base font, a default shader, and a CRT-style postprocess pass.

## Typical Flow

The simplest way to think about PixelStorm is:

1. Create an `Application`.
2. Load the resources your game needs.
3. Register one or more scenes.
4. Activate the first scene.
5. Let the engine run the frame loop.

:::tip
If you are coming from the demo, the best entry point is `demo/src/main.cpp`.
That file shows the real startup sequence used by the project.
:::
