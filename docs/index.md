---
title: PixelStorm API Docs
sidebar_position: 0
---

# PixelStorm API Docs

This documentation covers the public PixelStorm API exactly as it is meant to be used from gameplay code.

## What you will find

- A quick start guide to open a working window in a few minutes.
- Public API reference, organized by module.
- Real usage patterns taken from the engine and the demo.
- Clear notes about limits, defaults, and behaviors that often surprise new users.

:::important
These pages document only the public API used from gameplay code.
If something is not exposed in the public headers or does not appear in real repo usage, it is not documented here.
:::

## Recommended path

1. Start with [Getting Started](/docs/getting-started).
2. Continue with [Quick Start Guide](/docs/quick-start).
3. Use the module reference pages when you need deeper detail.

## Scope

| Area | What it covers |
| --- | --- |
| Core | `Application`, `Time`, `Log`, `Color`, `Math` |
| Window / Application | window, lifecycle, resources, camera, UI |
| ECS | `Entity`, `World`, `Registry`, component helpers |
| Rendering | textures, fonts, shaders, render pipeline |
| Gameplay systems | scenes, input, physics, animation, particles |

:::tip
If you are coming from the demo, the closest real-project entry point is `demo/src/main.cpp`.
:::
