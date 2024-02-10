import { Hono } from 'hono'

type Bindings = {
  HONOLINK: KVNamespace
}

const app = new Hono<{ Bindings: Bindings }>()

app.get('/', c => {
  return c.text('Hono URL Shortener')
})

app.get('/notfound', c => {
  return c.notFound()
})

app.get('/:shortlink', async c => {
  const shortlink = c.req.param('shortlink')
  const longlink = await c.env.HONOLINK.get(shortlink) || '/notfound'

  return c.redirect(longlink)
})

app.post('/', async c => {
  const body = await c.req.json()
  await c.env.HONOLINK.put(body.short, body.long)

  return c.json({ status: 200 })
})

export default app
