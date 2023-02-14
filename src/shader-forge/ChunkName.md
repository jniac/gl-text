From [ShaderChunk.js](https://raw.githubusercontent.com/mrdoob/three.js/master/src/renderers/shaders/ShaderChunk.js),
execute the following script (console):

```js
const str = document.querySelector('pre').innerText

const tokens = [...str.matchAll(/import\ (\w+)\ from\ '.\/ShaderChunk/g)]
    .map(([, g]) => g)

const names = tokens.map(t => `  | '${t}'`).join('\n')

const code = `// ${window.location.href}
/** @public */
export type ChunkName = \n${names}`

console.log(code)

copy(code)
```