# gl-text

gl-text is for rendering an insane number (> 100K) of small texts (max 48 chars) with ThreeJS, for
debugging purpose essentially (eg: Mesh inspection).

<a href="https://jniac.github.io/gl-text/test/stress/">
  <img src="screenshots/jpg/test_stress-q60.jpg">
</a>

## Features

- Colors:
  - text & background
  - with opacity!

- Multiple lines
  - up to 8 lines (but since only 48 chars ares supported, 3 or 4 is a maximum in real use cases).

- Billboard mode  
  - By default the text instances are facing the camera
  - But it can be prevented: `new GlText({ billboard: false })`

- Supports mipmaps
  - Because every chars is drawn through separated triangles (2 triangles actually)
    mimaps works without any troubles (it was not the case with previous technic
    using a single plane for multiple chars).

## Usage
```ts
const glText = new GlText({
  maxCount: 100_000, // default is 2000
  col = 16, // default is 12
  row = 3, // default is 2
  billboard = false, // default is true
})

scene.add(glText)

glText.setTextAt(0, 'foo', {
  position: new Vector3(4, 2, 1),
  color: 'red',
  background: 'yellow',
  size: 2,
})
```

## Info

The output (js, .d.ts + map) is generated (but not commited) in the lib folder.

## Dev

```
pnpm dev
```

