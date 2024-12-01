import * as fs from 'node:fs/promises'
import { createReadStream } from 'node:fs'
import * as path from 'node:path'
import Koa from 'koa'
import serveStatic from 'koa-static'
import Router from '@koa/router'
import render from '@koa/ejs'
import mime from 'mime'

/**
 * @param {Object} options
 * @param {number} options.port,
 * @param {string} options.dir
 */
export function start(options) {
  const {
    port,
    dir: root,
  } = options

  const app = new Koa()
  const router = new Router()

  render(app, {
    root: path.join(import.meta.dirname, 'view'),
    layout: false,
    cache: false,
  })

  app.use(serveStatic('./public'))

  router.get(/\.md$/i, async (ctx) => {
    const filepath = path.join(root, decodeURIComponent(ctx.path))
    const content = await fs.readFile(filepath, { encoding: 'utf8' })
    return ctx.render('mk', { content })
  })

  router.get('(.*)', async (ctx, next) => {
    const filepath = path.join(root, decodeURIComponent(ctx.path))

    if (await isDirectory(filepath)) {
      const files = await fs.readdir(filepath)
      return ctx.render('dir', {
        files: files
          .filter((f) => !f.startsWith('.') && f !== 'rs')
          .map((f) => decodeURIComponent(path.join(ctx.path, f)))
      })
    }

    ctx.set({
      'content-type': mime.getType(ctx.path)
    })

    ctx.body = createReadStream(filepath)
  })

  app
    .use(router.routes())
    .use(router.allowedMethods())

  app.listen(port, () => {
    console.log(`mk-lite is serving ${root} at http://localhost:${port}`)
  })
}

/**
 * @param {string} path
 */
async function isDirectory(path) {
  try {
    const stat = await fs.stat(path)
    return stat.isDirectory()
  } catch (e) {
  }

  return false
}

