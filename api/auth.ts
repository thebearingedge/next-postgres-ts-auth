import { FastifyPluginAsync } from 'fastify'

const handleSignIn: FastifyPluginAsync = async app => {

  const { sql } = app.services

  app.post('/api/sign-in', async (req, res) => {
    res.send({ hello: 'world' })
  })

  app.post('/api/sign-up', async (req, res) => {
    res.send({ hello: 'world' })
  })

  app.post('/api/sign-out', async (req, res) => {
    res.send({ hello: 'world' })
  })

}

export default handleSignIn
