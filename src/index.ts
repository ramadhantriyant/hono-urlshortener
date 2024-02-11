import { Hono } from 'hono'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'

type Bindings = {
  HONOLINK: KVNamespace
}

const app = new Hono<{ Bindings: Bindings }>()
const schema = z.object({ short: z.string(), long: z.string() })

app.get('/', (c) => {
  return c.text('Hono URL Shortener')
})

app.on('POST' || 'PUT', '/', zValidator('json', schema), async (c) => {
  const { short, long } = await c.req.json()
  await c.env.HONOLINK.put(short, long)

  return c.json({ status: 201, message: 'Created' }, 201)
})

app.get('/notfound', (c) => {
  return c.notFound()
})

app.get('/:shortlink', async (c) => {
  const key = c.req.param('shortlink')
  const value = await c.env.HONOLINK.get(key);

  return c.redirect(value || '/notfound')
})

app.delete('/:shortlink', async (c) => {
  const key = c.req.param('shortlink')
  await c.env.HONOLINK.delete(key)

  return c.json({ status: 200, message: 'Deleted' })
})

export default app
