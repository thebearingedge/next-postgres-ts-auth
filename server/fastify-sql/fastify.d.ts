import { Sql } from 'postgres'

declare module 'fastify' {
  interface FastifyInstance<RawServer, RawRequest, RawReply> {
    services: {
      sql: Sql
    }
  }
}
