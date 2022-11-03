import 'dotenv/config'
import url from 'node:url'
import fastify from 'fastify'
import fastifyNext from '@fastify/nextjs'
import fastifyCookie from '@fastify/cookie'
import fastifyAutoload from '@fastify/autoload'
import fastifySql from './fastify-sql/index.js'
import { COOKIE_SECRET } from '../lib/auth/config.js'

const app = fastify()

app.register(fastifyCookie, {
  secret: [COOKIE_SECRET]
})

app.register(fastifySql, {
  url: process.env.DATABASE_URL ?? ''
})

app.register(fastifyAutoload, {
  prefix: '/api',
  forceESM: true,
  dir: url.fileURLToPath(new URL('../api', import.meta.url))
})

app
  .register(fastifyNext, { dev: process.env.NODE_ENV !== 'production' })
  .after(() => app.next('/*'))

app.setErrorHandler((err, req, res) => {
  console.error(err)
  res.status(500).send({ error: 'an unexpected error occurred' })
})

app.listen({ port: Number(process.env.PORT) }, err => {
  if (err != null) {
    console.error(err)
    process.exit(1)
  }
  console.clear()
  console.log(`\napp listening on port ${process.env.PORT}\n`)
})
