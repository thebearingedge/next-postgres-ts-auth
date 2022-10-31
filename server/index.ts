import 'dotenv/config'
import fastify from 'fastify'
import fastifyNext from '@fastify/nextjs'

const app = fastify()

app
  .register(fastifyNext, { dev: process.env.NODE_ENV !== 'production' })
  .after(() => app.next('/*'))

app.listen({ port: Number(process.env.PORT) }, (err, address) => {
  if (err != null) {
    console.error(err)
    process.exit(1)
  }
  console.clear()
  console.log(`app listening on port ${process.env.PORT}`)
})
