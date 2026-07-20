// Zero-dependency static server for Swagger UI + the OpenAPI spec.
// Serves this directory (swagger.html, openapi.yaml, node_modules/swagger-ui-dist/*)
// so Swagger UI "Try it out" can execute against the Prism mock on :4010.
import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { extname, normalize, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('.', import.meta.url))
const port = Number(process.env.PORT) || 8088
const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.yaml': 'application/yaml; charset=utf-8',
  '.yml': 'application/yaml; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.map': 'application/json',
}

createServer(async (req, res) => {
  let path = decodeURIComponent(req.url.split('?')[0])
  if (path === '/') path = '/swagger.html'
  const file = join(root, normalize(path).replace(/^(\.\.[/\\])+/, ''))
  if (!file.startsWith(root)) {
    res.writeHead(403).end('Forbidden')
    return
  }
  try {
    const body = await readFile(file)
    res.writeHead(200, {
      'content-type': types[extname(file)] || 'application/octet-stream',
    })
    res.end(body)
  } catch {
    res.writeHead(404).end('Not found')
  }
}).listen(port, '127.0.0.1', () => {
  console.log(`Swagger UI: http://127.0.0.1:${port}/  (spec: ./openapi.yaml — Try-it-out targets the Prism mock on :4010)`)
})
