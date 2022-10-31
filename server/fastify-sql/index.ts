import postgres from 'postgres'
import fp from 'fastify-plugin'
import { FastifyPluginAsync } from 'fastify'

type FastifySqlOptions = {
  url: string,
  options?: postgres.Options<{}>
}

const fastifySql: FastifyPluginAsync<FastifySqlOptions> = async (app, opts) => {
  app.decorate('services', {
    sql: postgres(opts.url, opts.options)
  })
}

export default fp(fastifySql, {
  fastify: '4.x',
  name: 'fastify-sql'
})
